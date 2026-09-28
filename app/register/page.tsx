"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    UserPlus,
    CheckCircle2,
    ChevronDown,
    Info,
    ArrowRight,
    User
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    // 1. State to track form inputs
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        age: "",
        gender: "",
        bloodGroup: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // 2. Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Prevent negative values for the age field specifically
        if (name === "age" && Number(value) < 0) {
            return; // Stop execution, don't update the state
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    age: Number(formData.age),
                    gender: formData.gender
                        ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)
                        : formData.gender,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Unable to register patient");
            }

            router.push("/dashboard/admin");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to register patient");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Calculate Progress Percentage
    const totalFields = 6; // Total number of inputs
    // Count how many fields have text in them (aren't empty)
    const filledFields = Object.values(formData).filter((val) => val.trim() !== "").length;
    // Calculate the percentage
    const progressPercentage = Math.round((filledFields / totalFields) * 100);

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center p-6 font-sans text-slate-800">

            {/* HEADER */}
            <header className="w-full max-w-6xl flex justify-between items-center py-4 mb-4 lg:mb-8">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                        <Activity className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        PulseLink <span className="text-blue-600"></span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-slate-900">Dr. Sarah Miller</div>
                        <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            Attending Physician
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
                        <User className="h-5 w-5 text-slate-500" />
                    </div>
                </div>
            </header>

            {/* MAIN REGISTRATION CARD */}
            <main className="w-full max-w-4xl bg-white rounded-4xl shadow-xl shadow-slate-200/50 p-8 md:p-12 lg:p-16">

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            New Patient Intake
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Register clinical record for the PulseLink AI system.
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <UserPlus className="h-6 w-6" />
                    </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-3">
                        <span className="text-blue-600">Step 1: Patient Profile</span>
                        <span className="text-slate-700">{progressPercentage}% COMPLETE</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }} // Updates width based on state
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <form className="space-y-8" onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* FULL NAME */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="e.g. Sarah Miller"
                                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
                                />
                                {/* Conditionally render green tick */}
                                {formData.fullName.trim() !== "" && (
                                    <CheckCircle2 className="absolute right-4 top-3.5 h-5 w-5 text-emerald-500 transition-opacity" />
                                )}
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="sarah.m@clinical.com"
                                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
                                />
                                {formData.email.trim() !== "" && (
                                    <CheckCircle2 className="absolute right-4 top-3.5 h-5 w-5 text-emerald-500 transition-opacity" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* AGE */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Age
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="age"
                                    required
                                    min="1"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Years"
                                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
                                />
                                {formData.age.trim() !== "" && (
                                    <CheckCircle2 className="absolute right-4 top-3.5 h-5 w-5 text-emerald-500 transition-opacity" />
                                )}
                            </div>
                        </div>

                        {/* GENDER */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Gender
                            </label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full appearance-none bg-slate-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {/* Swap Chevron for Green Tick when selected */}
                                {formData.gender.trim() !== "" ? (
                                    <CheckCircle2 className="absolute right-4 top-4 h-4 w-4 text-emerald-500 pointer-events-none" />
                                ) : (
                                    <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-500 pointer-events-none" />
                                )}
                            </div>
                        </div>

                        {/* BLOOD GROUP */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Blood Group
                            </label>
                            <div className="relative">
                                <select
                                    name="bloodGroup"
                                    required
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full appearance-none bg-slate-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>

                                </select>
                                {formData.bloodGroup.trim() !== "" ? (
                                    <CheckCircle2 className="absolute right-4 top-4 h-4 w-4 text-emerald-500 pointer-events-none" />
                                ) : (
                                    <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-500 pointer-events-none" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PHONE NUMBER */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Phone Number
                        </label>
                        <div className="flex gap-3">
                            <div className="whitespace-nowrap px-5 bg-slate-50 rounded-xl py-3.5 text-sm text-slate-900 flex items-center justify-center font-medium">
                                +234 (NIG)
                            </div>
                            <div className="relative flex-1">
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(+234) 000-0000-00"
                                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
                                />
                                {formData.phone.trim() !== "" && (
                                    <CheckCircle2 className="absolute right-4 top-3.5 h-5 w-5 text-emerald-500 transition-opacity" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Data is encrypted using AES-256 standards for HIPAA compliance. All fields marked with an asterisk are required for medical records.
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                        <button
                            type="button"
                            className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                        >
                            {isLoading ? "Registering..." : "Register User"}

                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                </form>
            </main>

            <footer className="mt-12 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Powered by PulseLink AI Clinical Systems • Security Version 2.4.0
            </footer>

        </div>
    );
}