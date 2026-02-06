"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiCamera, FiCheckCircle, FiRefreshCw, FiImage, FiXCircle, FiLayers } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UploadCapture({
    label,
    onUpload,
    value,
    id,
    required = false,
    placeholder = "Select or Capture Image",
    memberId = null
}) {
    const [mode, setMode] = useState("idle"); // idle, gallery, camera, library
    const [preview, setPreview] = useState(value);
    const [error, setError] = useState(null);
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setPreview(value);
    }, [value]);

    useEffect(() => {
        if (mode === "library" && memberId && assets.length === 0) {
            fetchAssets();
        }
    }, [mode, memberId]);

    const fetchAssets = async () => {
        setLoadingAssets(true);
        try {
            const res = await fetch(`/api/member/${memberId}/assets`);
            if (res.ok) {
                const data = await res.json();
                setAssets(data);
            }
        } catch (err) {
            console.error("Failed to fetch assets", err);
        } finally {
            setLoadingAssets(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setPreview(base64String);
            if (onUpload) onUpload(base64String, file.name);
            setMode("idle");
            toast.success("Asset captured from gallery");
        };
        reader.readAsDataURL(file);
    };

    const startCamera = async () => {
        setMode("camera");
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Camera access denied or unavailable.");
            setMode("idle");
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg");

            // Stop stream
            const stream = video.srcObject;
            stream.getTracks().forEach(track => track.stop());

            setPreview(dataUrl);
            if (onUpload) onUpload(dataUrl, "capture.jpg");
            setMode("idle");
            toast.success("Image captured from sensor");
        }
    };

    const selectFromLibrary = (url) => {
        setPreview(url);
        if (onUpload) onUpload(url, "library_asset.jpg");
        setMode("idle");
        toast.success("Asset reused from library");
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className={`relative min-h-[220px] rounded-[2.5rem] border-2 border-dashed overflow-hidden transition-all duration-500 flex flex-col items-center justify-center p-6 ${preview
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-slate-200 dark:border-slate-800 hover:border-primary-500/50 bg-slate-50 dark:bg-slate-950/50"
                }`}>

                {mode === "idle" && (
                    <>
                        {preview ? (
                            <div className="relative w-full h-full flex flex-col items-center gap-6 animate-in zoom-in-95">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreview(null);
                                            if (onUpload) onUpload(null, null);
                                        }}
                                        className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:scale-110 transition-transform"
                                    >
                                        <FiRefreshCw />
                                    </button>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-500/20">
                                        <FiCheckCircle /> Verified Asset
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4">
                                <div className="w-20 h-20 bg-primary-500/10 text-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                                    <FiImage size={32} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{placeholder}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">Select from gallery, camera, or your asset library</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm"
                                    >
                                        <FiUpload /> Gallery
                                    </button>
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        className="flex items-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
                                    >
                                        <FiCamera /> Camera
                                    </button>
                                    {memberId && (
                                        <button
                                            type="button"
                                            onClick={() => setMode("library")}
                                            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                                        >
                                            <FiLayers /> Library
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        )}
                    </>
                )}

                {mode === "camera" && (
                    <div className="relative w-full aspect-video md:aspect-square max-h-[400px] animate-in fade-in duration-500">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover rounded-[2rem]"
                        />
                        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4 px-8">
                            <button
                                type="button"
                                onClick={() => setMode("idle")}
                                className="p-4 bg-white/10 backdrop-blur-xl text-white rounded-full hover:bg-white/20 transition-all"
                            >
                                <FiXCircle size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all"
                            >
                                <div className="w-12 h-12 border-2 border-slate-900 rounded-full" />
                            </button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                )}

                {mode === "library" && (
                    <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center px-2">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Asset Repository</h5>
                            <button type="button" onClick={() => setMode("idle")} className="text-[10px] font-black uppercase text-red-500 font-black">Cancel</button>
                        </div>

                        {loadingAssets ? (
                            <div className="h-32 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : assets.length === 0 ? (
                            <div className="h-32 flex flex-col items-center justify-center text-slate-400 italic text-[10px]">
                                No previous assets found in your profile.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4 overflow-y-auto max-h-[300px] p-2">
                                {assets.map((asset, i) => (
                                    <div
                                        key={i}
                                        onClick={() => selectFromLibrary(asset.url)}
                                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary-500 transition-all shadow-md"
                                    >
                                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-all flex items-center justify-center">
                                            <FiCheckCircle className="text-white opacity-0 group-hover:opacity-100 transition-all" size={24} />
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                            <p className="text-[8px] font-black text-white uppercase truncate">{asset.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-[10px] font-bold text-red-500 ml-1 animate-pulse uppercase tracking-tighter">
                    -- FAILURE: {error}
                </p>
            )}
        </div>
    );
}
