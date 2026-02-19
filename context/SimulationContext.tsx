
import React, { createContext, useReducer, useContext, Dispatch, PropsWithChildren } from 'react';
import { Patient, Appointment, LoggedAction, LedgerEntry, ToothState, ToothStatus, PatientDocument, SimulationState, InsuranceVerification, AuditEntry, MedicalRecord, ToastMessage, Task, PortalMessage, PreAuthorization, InsuranceClaim, RecallType } from '../types';
import { PATIENTS_DATA, APPOINTMENTS_DATA } from '../data/patients';
import { VERIFICATIONS_DATA } from '../data/verifications';
import { MEDICAL_RECORDS_DATA } from '../data/medicalRecords';
import { SANDBOX_TASKS } from '../constants';

type Action =
  | { type: 'SELECT_PATIENT'; payload: number | null }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: number }
  | { type: 'SCHEDULE_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string } 
  | { type: 'CANCEL_APPOINTMENT'; payload: string } 
  | { type: 'ADD_LEDGER_ENTRY'; payload: { patientId: number; entry: Omit<LedgerEntry, 'id' | 'balance'> } }
  | { type: 'UPDATE_CHART'; payload: { patientId: number; toothState: ToothState } }
  | { type: 'BULK_UPDATE_CHART'; payload: { patientId: number; updates: ToothState[] } }
  | { type: 'LOG_ACTION'; payload: { type: string; details: any } }
  | { type: 'ADD_FAMILY_MEMBER'; payload: { patientData: Patient; familyLinkToId: number } }
  | { type: 'ADD_DOCUMENT'; payload: { patientId: number; document: Omit<PatientDocument, 'id'> } }
  | { type: 'ADD_UNASSIGNED_DOCUMENT'; payload: Omit<PatientDocument, 'id'> }
  | { type: 'UPDATE_UNASSIGNED_DOCUMENT'; payload: PatientDocument }
  | { type: 'DELETE_UNASSIGNED_DOCUMENT'; payload: string }
  | { type: 'ASSIGN_DOCUMENT_TO_PATIENT'; payload: { documentId: string; patientId: number; finalDocument: PatientDocument } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PIN_APPOINTMENT'; payload: string } 
  | { type: 'WAITLIST_APPOINTMENT'; payload: string } 
  | { type: 'MOVE_APPOINTMENT'; payload: { appointmentId: string; newStartTime: Date; newOperatory: number; source: 'calendar' | 'pinboard' | 'waitlist' } }
  | { type: 'UPDATE_DAY_NOTE'; payload: { date: string; note: string } }
  | { type: 'ADD_VERIFICATION'; payload: InsuranceVerification }
  | { type: 'UPDATE_VERIFICATION'; payload: InsuranceVerification }
  | { type: 'BULK_UPDATE_VERIFICATIONS'; payload: { ids: string[]; changes: Partial<InsuranceVerification> } }
  | { type: 'ADD_MEDICAL_RECORD'; payload: MedicalRecord }
  | { type: 'UPDATE_MEDICAL_RECORD'; payload: MedicalRecord }
  | { type: 'ADD_TOAST'; payload: Omit<ToastMessage, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MOVE_PLANNED_TREATMENT'; payload: { patientId: number; sourceToothNumber: number; targetToothNumber: number } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'TOGGLE_TASK_COMPLETE'; payload: string }
  | { type: 'MARK_TASK_REMINDED'; payload: string }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'SEND_PORTAL_REPLY'; payload: { messageId: string; content: string } }
  | { type: 'ADD_PREAUTH'; payload: PreAuthorization }
  | { type: 'ADD_CLAIM'; payload: InsuranceClaim }
  | { type: 'UPDATE_CLAIM'; payload: InsuranceClaim }
  | { type: 'ADD_RECALL_TYPE'; payload: RecallType }
  | { type: 'UPDATE_RECALL_TYPE'; payload: RecallType }
  | { type: 'START_ASSESSMENT' }
  | { type: 'END_ASSESSMENT' }
  | { type: 'RESTART_ALL' };

const getPastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

const initialState: SimulationState = {
  patients: PATIENTS_DATA,
  appointments: APPOINTMENTS_DATA,
  verifications: VERIFICATIONS_DATA,
  medicalRecords: MEDICAL_RECORDS_DATA,
  tasks: [
      { id: 't1', title: 'Verify benefits for J. Smith', dueDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(), completed: false, reminded: false, priority: 'High' },
      { id: 't2', title: 'Call Lab regarding case #4422', dueDate: new Date(Date.now() + 1000 * 60 * 120).toISOString(), completed: false, reminded: false, priority: 'Medium' },
      { id: 't3', title: "Follow up on patient X's lab results", dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), completed: false, reminded: false, priority: 'High' },
  ],
  portalMessages: [
    { id: 'm1', patientId: 13, subject: 'Pain after SRP', content: 'Hi Dr. Jones, I am still having some lingering sensitivity after my scaling last week. Is this normal?', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), status: 'Unread', category: 'Medical Question' },
    { id: 'm2', patientId: 41, subject: 'Insurance question', content: 'I received a statement but thought my insurance covered 100%. Can you double check?', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'Unread', category: 'Billing' },
    { id: 'm3', patientId: 4, subject: 'Reschedule my extraction', content: 'Something came up for Thursday. Do you have anything next Monday morning instead?', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), status: 'Unread', category: 'Appointment Request' },
    { id: 'm4', patientId: 6, subject: 'Antibiotic refill', content: 'My pharmacy says the prescription is out of refills. Can you send a new one?', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), status: 'Unread', category: 'Refill' },
    { id: 'm5', patientId: 1, subject: 'Thank you!', content: 'Just wanted to say the crown feels great. Thanks for the quick work!', timestamp: new Date(Date.now() - 1000 * 3600 * 24).toISOString(), status: 'Read', category: 'Other' },
  ],
  preAuthorizations: [
      { id: 'PA-1001', patientId: 1, dateSubmitted: getPastDate(15), status: 'Pending', payer: 'MetLife PPO', totalValue: 2100, items: [{ tooth: 13, procedure: 'RCT', fee: 900 }, { tooth: 14, procedure: 'Crown', fee: 1200 }] },
      { id: 'PA-1002', patientId: 4, dateSubmitted: getPastDate(45), status: 'More Info Required', payer: 'Cigna', totalValue: 300, items: [{ tooth: 30, procedure: 'Extraction', fee: 300 }] },
      { id: 'PA-1003', patientId: 6, dateSubmitted: getPastDate(5), status: 'Pending', payer: 'Aetna', totalValue: 900, items: [{ tooth: 18, procedure: 'RCT', fee: 900 }] },
      { id: 'PA-1004', patientId: 2, dateSubmitted: getPastDate(2), status: 'Approved', payer: 'Delta Dental', totalValue: 1200, items: [{ tooth: 2, procedure: 'Crown', fee: 1200 }] },
  ],
  recallTypes: [
    { id: 'r1', shortName: 'PRO', description: 'Adult Prophylaxis', intervalDays: 180, procedureCode: 'D1110' },
    { id: 'r2', shortName: 'PERIO', description: 'Periodontal Maintenance', intervalDays: 90, procedureCode: 'D4910' },
    { id: 'r3', shortName: 'BWX', description: 'Bite-Wings X-Ray', intervalDays: 365, procedureCode: 'D0274' },
    { id: 'r4', shortName: 'EXAM', description: 'Periodic Oral Exam', intervalDays: 180, procedureCode: 'D0120' },
  ],
  claims: [
      { 
        id: 'CLM-001', 
        patientId: 6, 
        dateCreated: getPastDate(5), 
        status: 'Sent', 
        carrier: 'Aetna', 
        totalAmount: 1200, 
        procedureIds: ['l6-1'], 
        diagnosticCodes: [],
        statusHistory: [{ date: getPastDate(5), status: 'Sent' }],
        attachments: { 
          images: [], 
          perioChartAttached: false, 
          photoAttached: false, 
          txPlanAttached: false 
        } 
      }
  ],
  selectedPatientId: 1,
  actions: [],
  history: { past: [], future: [] },
  pinboardAppointments: [],
  waitlistAppointments: [],
  unassignedDocuments: [],
  dayNotes: {},
  toasts: [],
  completedSandboxTasks: SANDBOX_TASKS.reduce((acc, task, index) => {
    acc[index] = Array(task.steps.length).fill(false);
    return acc;
  }, {} as Record<number, boolean[]>),
  assessmentMode: false,
  assessmentAttempts: 0,
};

function simulationReducer(state: SimulationState, action: Action): SimulationState {
  // Helper to mark assessment steps automatically
  const verifyStep = (taskIdx: number, stepIdx: number, newState: SimulationState) => {
    const newCompleted = { ...newState.completedSandboxTasks };
    const steps = [...(newCompleted[taskIdx] || [])];
    if (!steps[stepIdx]) {
      steps[stepIdx] = true;
      newCompleted[taskIdx] = steps;
      return { ...newState, completedSandboxTasks: newCompleted };
    }
    return newState;
  };

  let nextState = state;

  switch (action.type) {
    case 'START_ASSESSMENT':
      return { ...initialState, assessmentMode: true, assessmentAttempts: state.assessmentAttempts + 1 };
    case 'END_ASSESSMENT':
      return { ...state, assessmentMode: false };
    case 'RESTART_ALL':
      return { ...initialState, assessmentAttempts: state.assessmentAttempts };
    case 'SELECT_PATIENT':
      nextState = { ...state, selectedPatientId: action.payload };
      if (action.payload !== null) nextState = verifyStep(0, 0, nextState); // Search/Select patient
      break;
    case 'ADD_PATIENT': {
      const nextId = Math.max(...state.patients.map(p => p.id), 0) + 1;
      const newPatient = { ...action.payload, id: nextId };
      nextState = { ...state, patients: [...state.patients, newPatient], selectedPatientId: newPatient.id };
      nextState = verifyStep(1, 0, nextState); // Create new patient
      break;
    }
    case 'ADD_FAMILY_MEMBER': {
      const { patientData, familyLinkToId } = action.payload;
      const nextId = Math.max(...state.patients.map(p => p.id), 0) + 1;
      const newPatient: Patient = { ...patientData, id: nextId };
      nextState = { ...state, patients: [...state.patients, newPatient], selectedPatientId: nextId };
      nextState = verifyStep(1, 1, nextState); // Add family member
      break;
    }
    case 'UPDATE_PATIENT': {
      const oldPatient = state.patients.find(p => p.id === action.payload.id);
      nextState = { ...state, patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p) };
      
      // Module 2 checks
      if (action.payload.address !== oldPatient?.address) nextState = verifyStep(1, 2, nextState); // Demographics
      if ((action.payload.medicalAlerts?.length || 0) > (oldPatient?.medicalAlerts?.length || 0)) nextState = verifyStep(1, 3, nextState); // Medical Alert
      
      // Step 4: Status Update
      if (action.payload.status === 'Inactive' && oldPatient?.status === 'Active') {
          nextState = verifyStep(1, 4, nextState);
      }
      
      // Step 5: Automation Toggle (Check if any of the reminder flags or master toggle changed)
      if (
          action.payload.automationActive !== oldPatient?.automationActive ||
          action.payload.sendConfirmation14Days !== oldPatient?.sendConfirmation14Days ||
          action.payload.sendReminder2Days !== oldPatient?.sendReminder2Days ||
          action.payload.sendFollowUpOnCancel !== oldPatient?.sendFollowUpOnCancel
      ) {
          nextState = verifyStep(1, 5, nextState);
      }

      // Step 6: Photo (If photoUrl exists and is different)
      if (action.payload.photoUrl && action.payload.photoUrl !== oldPatient?.photoUrl) {
          nextState = verifyStep(1, 6, nextState);
      }
      break;
    }
    case 'SCHEDULE_APPOINTMENTS':
      nextState = { ...state, appointments: [...state.appointments, ...action.payload] };
      nextState = verifyStep(0, 1, nextState); // Book slot
      if (action.payload.some(a => a.provider === 'Dr. Smith')) nextState = verifyStep(0, 2, nextState); // Assign Dr Smith
      if (action.payload.some(a => a.isBlock)) nextState = verifyStep(0, 4, nextState); // Block Provider
      break;
    case 'UPDATE_APPOINTMENT': {
      const prevApt = state.appointments.find(a => a.id === action.payload.id);
      nextState = { ...state, appointments: state.appointments.map(apt => apt.id === action.payload.id ? action.payload : apt) };
      if (action.payload.status === 'FIRM') nextState = verifyStep(0, 3, nextState); // Confirm Status
      
      // Also verify reschedule if time or op changed via edit modal
      if (prevApt && (
          prevApt.startTime.getTime() !== action.payload.startTime.getTime() || 
          prevApt.operatory !== action.payload.operatory
      )) {
          nextState = verifyStep(0, 5, nextState);
      }
      break;
    }
    case 'MOVE_APPOINTMENT':
      nextState = { ...state, appointments: state.appointments.map(a => a.id === action.payload.appointmentId ? { ...a, startTime: action.payload.newStartTime, operatory: action.payload.newOperatory } : a) };
      nextState = verifyStep(0, 5, nextState); // Reschedule
      break;
    case 'PIN_APPOINTMENT':
      nextState = { ...state, appointments: state.appointments.filter(a => a.id !== action.payload), pinboardAppointments: [...state.pinboardAppointments, state.appointments.find(a=>a.id===action.payload)!] };
      nextState = verifyStep(0, 6, nextState); // Pinboard
      break;
    case 'ADD_LEDGER_ENTRY': {
        const { patientId, entry } = action.payload;
        nextState = { ...state, patients: state.patients.map(p => {
            if (p.id === patientId) return { ...p, ledger: [...p.ledger, { ...entry, id: `l-${Date.now()}`, balance: 0 }] };
            return p;
        })};
        nextState = verifyStep(2, 0, nextState); // View/Entry Ledger
        if (entry.payment === 100) nextState = verifyStep(2, 1, nextState); // Post $100
        if (entry.charge > 0) nextState = verifyStep(2, 2, nextState); // New Charge
        if (entry.writeOff > 0) nextState = verifyStep(2, 3, nextState); // Adjustment
        if (entry.description.toLowerCase().includes('refund')) nextState = verifyStep(2, 6, nextState); // Refund
        break;
    }
    case 'ADD_CLAIM':
        nextState = { ...state, claims: [...state.claims, action.payload] };
        nextState = verifyStep(2, 4, nextState); // Claim
        break;
    case 'ADD_PREAUTH':
        nextState = { ...state, preAuthorizations: [...state.preAuthorizations, action.payload] };
        nextState = verifyStep(2, 5, nextState); // Pre-auth
        break;
    case 'UPDATE_CHART':
        nextState = { ...state, patients: state.patients.map(p => p.id === action.payload.patientId ? { ...p, chart: [...p.chart, action.payload.toothState] } : p) };
        if (action.payload.toothState.status === ToothStatus.Missing) nextState = verifyStep(4, 1, nextState); // Missing
        if (action.payload.toothState.status === ToothStatus.TreatmentPlanned) nextState = verifyStep(4, 2, nextState); // TX Plan
        if (action.payload.toothState.procedure) nextState = verifyStep(4, 3, nextState); // Procedure
        if (action.payload.toothState.notes) nextState = verifyStep(4, 4, nextState); // Save Note
        nextState = verifyStep(4, 6, nextState); // History log updated
        break;
    case 'BULK_UPDATE_CHART':
        nextState = { ...state, patients: state.patients.map(p => p.id === action.payload.patientId ? { ...p, chart: [...p.chart, ...action.payload.updates] } : p) };
        nextState = verifyStep(4, 5, nextState); // Bulk Update
        break;
    case 'LOG_ACTION':
        nextState = { ...state, actions: [...state.actions, { ...action.payload, timestamp: new Date() }] };
        if (action.payload.details?.reportName === 'Day Sheet') nextState = verifyStep(3, 0, nextState); // Day Sheet
        if (action.payload.type === 'run_report') nextState = verifyStep(3, 1, nextState); // Update Date
        if (action.payload.details?.reportName === 'Deposit Slip') nextState = verifyStep(3, 2, nextState); // Deposit Slip
        if (action.payload.details?.reportName === 'Recall Management') nextState = verifyStep(3, 3, nextState); // Recall Hub
        if (action.payload.details?.reportName === 'End-of-Day') nextState = verifyStep(3, 6, nextState); // End of Day
        
        // Reliability fixes for Module 2 & 5 via direct actions
        if (action.payload.type === 'upload_photo') nextState = verifyStep(1, 6, nextState); // Photo
        if (action.payload.type === 'manual_reminder_send') nextState = verifyStep(1, 5, nextState); // Automation
        if (action.payload.type === 'tooth_search') nextState = verifyStep(4, 0, nextState); // Module 5: Tooth Search
        break;
    case 'ADD_RECALL_TYPE':
        nextState = { ...state, recallTypes: [...state.recallTypes, action.payload] };
        nextState = verifyStep(3, 4, nextState); // Recall Config
        break;
    case 'ADD_TOAST':
        nextState = { ...state, toasts: [...state.toasts, { ...action.payload, id: `toast-${Date.now()}` }] };
        if (action.payload.message.toLowerCase().includes('export')) nextState = verifyStep(3, 5, nextState); // Export
        break;
    // Standard switch fallbacks
    case 'DELETE_PATIENT':
        nextState = { ...state, patients: state.patients.filter(p => p.id !== action.payload), selectedPatientId: null };
        break;
    case 'REMOVE_TOAST':
        nextState = { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        break;
    default:
        return state;
  }

  return nextState;
}

export const SimulationContext = createContext<{ state: SimulationState; dispatch: Dispatch<Action> } | undefined>(undefined);

export const SimulationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  return <SimulationContext.Provider value={{ state, dispatch }}>{children}</SimulationContext.Provider>;
};

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) throw new Error('useSimulationContext must be used within a SimulationProvider');
  return context;
};
