import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUpTask } from '../../types';
import {
  CheckSquare,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  User,
} from 'lucide-react';

export const TasksAndFollowUps: React.FC = () => {
  const { tasks, toggleTaskComplete, addTask, patients, staff } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<FollowUpTask['taskType']>('reassessment_due');
  const [dueDate, setDueDate] = useState('2026-11-02');
  const [priority, setPriority] = useState<FollowUpTask['priority']>('high');
  const [assignedTo, setAssignedTo] = useState('Dr. Priyanka Singh');

  const filteredTasks = tasks.filter((t) => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'pending') return !t.isCompleted;
    if (typeFilter === 'completed') return t.isCompleted;
    return t.taskType === typeFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const pat = patients.find((p) => p.id === selectedPatientId);

    addTask({
      patientId: selectedPatientId,
      patientName: pat?.fullName || 'Patient',
      title: taskTitle.trim(),
      taskType,
      dueDate,
      priority,
      assignedTo,
    });

    setTaskTitle('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <CheckSquare className="w-4 h-4 text-[#2D6A4F]" />
            <span>Care Coordination</span>
            <span>·</span>
            <span>Clinical Follow-ups</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Tasks, Recalls & Reassessment Reminders
          </h1>
          <p className="text-xs text-[#6B7280]">
            Track patients due for formal reassessments, missed appointment check-ins, and adherence alerts.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Follow-up Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All Tasks (${tasks.length})` },
          { id: 'pending', label: `Pending (${tasks.filter((t) => !t.isCompleted).length})` },
          { id: 'reassessment_due', label: 'Reassessment Due' },
          { id: 'missed_call', label: 'Missed Calls' },
          { id: 'exercise_review', label: 'Exercise Alerts' },
          { id: 'completed', label: 'Completed' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              typeFilter === f.id
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'bg-white border border-[#E5E5DF] text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#9CA3AF] bg-white rounded-xl border border-[#E5E5DF]">
            No tasks found in this category.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all text-xs flex items-start justify-between gap-4 ${
                task.isCompleted
                  ? 'bg-[#FAF9F5] border-[#E5E5DF] opacity-65'
                  : 'bg-white border-[#E5E5DF] hover:border-[#2D6A4F]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className={`mt-0.5 p-1 rounded transition-colors ${
                    task.isCompleted
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-[#9CA3AF] hover:text-[#1B4332]'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm ${
                        task.isCompleted ? 'line-through text-[#6B7280]' : 'text-[#111827]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        task.priority === 'urgent'
                          ? 'bg-red-50 text-red-700'
                          : task.priority === 'high'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                    <span>Patient: {task.patientName}</span>
                    <span aria-hidden="true">·</span>
                    <span>Assigned to: {task.assignedTo}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due: {task.dueDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className="text-[11px] font-medium capitalize text-[#6B7280] bg-[#FAF9F5] px-2 py-1 rounded border border-[#E5E5DF]">
                  {task.taskType.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-xl max-w-md w-full p-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-[#1B4332]">Create Clinical Follow-up Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.uhid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Week 8 Strength & ROM Reassessment"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs capitalize"
                  >
                    <option value="reassessment_due">Reassessment Due</option>
                    <option value="missed_call">Missed Appointment</option>
                    <option value="exercise_review">Exercise Adherence</option>
                    <option value="insurance">Billing / Balance</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs capitalize"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="routine">Routine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Assigned Clinician
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                  >
                    <option value="Dr. Priyanka Singh">Dr. Priyanka Singh</option>
                    <option value="Dr. Rohan Mehta">Dr. Rohan Mehta</option>
                    <option value="Sunita Rao">Sunita Rao (Front Desk)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 border border-[#E5E5DF] text-[#4B5563] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
