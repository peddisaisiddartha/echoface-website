import React, { useState } from "react";

const COLLEGES = [
  "MLR Institute of Technology",
  "IARE Dundigal",
  "BVRIT Narsapur",
  "Malla Reddy University",
];

export default function StudentProfileModal({
  isOpen,
  profile,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(profile?.name || "");
  const [college, setCollege] = useState(
    profile?.college || COLLEGES[0]
  );
  const [studentId, setStudentId] = useState(
    profile?.studentId || ""
  );

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedStudentId = studentId.trim();

    if (!trimmedName || !trimmedStudentId) {
      window.alert(
        "Please enter your name and student ID."
      );
      return;
    }

    onSave({
      name: trimmedName,
      college,
      studentId: trimmedStudentId,
      isVerified: true,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                EchoFace Student
              </p>

              <h2
                id="student-profile-title"
                className="mt-1 text-xl font-black text-slate-900"
              >
                Your Student Profile
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close student profile"
              className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              ×
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Save your basic student details so EchoFace can
            identify you when you post or book campus rides.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1 block text-sm font-bold text-slate-700"
            >
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="profile-college"
              className="mb-1 block text-sm font-bold text-slate-700"
            >
              College
            </label>

            <select
              id="profile-college"
              value={college}
              onChange={(event) =>
                setCollege(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {COLLEGES.map((collegeName) => (
                <option
                  key={collegeName}
                  value={collegeName}
                >
                  {collegeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-student-id"
              className="mb-1 block text-sm font-bold text-slate-700"
            >
              Student ID
            </label>

            <input
              id="profile-student-id"
              type="text"
              value={studentId}
              onChange={(event) =>
                setStudentId(event.target.value)
              }
              placeholder="e.g. 22R21A0001"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mt-1.5 text-[11px] text-slate-400">
              Demo verification currently accepts the ID
              you provide. Real college verification can be
              connected later.
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                ✓
              </div>

              <div>
                <p className="text-xs font-bold text-indigo-900">
                  Student profile
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-indigo-700">
                  Your profile is stored locally in this
                  browser for now.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-700"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}