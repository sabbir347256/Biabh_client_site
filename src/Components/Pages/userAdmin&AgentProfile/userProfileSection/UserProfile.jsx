import { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
    User, Briefcase, GraduationCap, Heart, Home,
    MapPin, Edit2, CheckCircle2,
    X, ShieldCheck, Camera,
    Phone,
    Mail,
    Globe,
    LucideClockFading,
    Upload,
    CheckCircle,
    AlertCircle,
    CreditCard,
    Sparkles,
    Wallet,
    Check
} from 'lucide-react';
import { AuthProvider } from '../../../AuthProvider/CreateContext';
import config from '../../utilies/envconfig';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router';
import PhotoGalleryView from './PhotoGalleryView';
import divisionsData from "../../../data/bd-divisions.json";
import districtsData from "../../../data/bd-districts.json";
import upazilasData from "../../../data/bd-upazilas.json";
import MeetupModal from './MeetupModal';

const UserProfile = () => {
    const { data: authContextData, token, refetch, isLoading } = useContext(AuthProvider);
    const profileUser = authContextData?.data;

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [isProfileLocked, setIsProfileLocked] = useState(true);
    const [editSections, setEditSections] = useState({
        header: false,
        personal: false,
        professional: false,
        contact: false,
        family: false,
        expectations: false
    });

    const [images, setImages] = useState({
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
    });

    const divisions = divisionsData?.data || divisionsData || [];
    const allDistricts = districtsData?.data || districtsData || [];
    const allUpazilas = upazilasData?.data || upazilasData || [];

    const [nidUploaded, setNidUploaded] = useState(false);
    const [nidSubmittedDb, setNidSubmittedDb] = useState(false);
    const [nidDbStatus, setNidDbStatus] = useState(null);

    const [isNidPaid, setIsNidPaid] = useState(false);
    const [isFieldPaid, setIsFieldPaid] = useState(false);
    const [fieldVerificationStatus, setFieldVerificationStatus] = useState('NOT_STARTED');

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isSubmittingNid, setIsSubmittingNid] = useState(false);

    const [currentDistricts, setCurrentDistricts] = useState([]);
    const [currentUpazilas, setCurrentUpazilas] = useState([]);
    const [permanentDistricts, setPermanentDistricts] = useState([]);
    const [permanentUpazilas, setPermanentUpazilas] = useState([]);

    const { register, handleSubmit, watch, reset, setValue } = useForm();

    const watchedCurrentDivision = watch("currentDivision");
    const watchedCurrentDistrict = watch("currentDistrict");
    const watchedPermanentDivision = watch("permanentDivision");
    const watchedPermanentDistrict = watch("permanentDistrict");

    const getProfileCompletion = () => {
        let percentage = 0;
        if (profileUser?.isActive === 'ACTIVE') {
            percentage = 30;
            if (profileUser?.isDocumentVerification || profileUser?.nidStatus === 'verified') {
                percentage = 60;
                if (profileUser?.isFieldVerification || fieldVerificationStatus === 'VERIFIED') {
                    percentage = 100;
                }
            }
        }
        return percentage;
    };

    useEffect(() => {
        const paymentStatus = searchParams.get('paymentStatus');
        const purpose = searchParams.get('purpose');

        if (!paymentStatus) return;

        if (paymentStatus === 'success') {
            refetch();

            if (purpose === 'NID_VERIFICATION') {
                setTimeout(() => {
                    toast.success('Your payment was successful! Admin will review and approve it within 30 minutes.');
                }, 3000);
            }
            // else if (purpose === 'FIELD_VERIFICATION') {
            //     toast.success('Your field verification payment was successful! Admin will review and approve it within 30 minutes.', {
            //         id: 'field-success',
            //         duration: 4000
            //     });
            // } else {
            //     toast.success('Payment completed successfully!', {
            //         id: 'general-success',
            //         duration: 3000
            //     });
            // }
        } else if (paymentStatus === 'fail') {
            setTimeout(() => {
                toast.error('Payment process failed or declined.');
            }, 3000);
        }

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        setSearchParams({}, { replace: true });

    }, [searchParams, setSearchParams, refetch]);

    useEffect(() => {
        if (profileUser) {
            reset({
                contactNo: profileUser?.contactNo || "",
                email: profileUser?.email || "",
                currentDivision: profileUser?.currentDivision,
                currentDistrict: profileUser?.currentDistrict,
                currentThana: profileUser?.currentThana,
                currentCountry: profileUser?.currentCountry || "Bangladesh",
                permanentDivision: profileUser?.permanentDivision,
                permanentDistrict: profileUser?.permanentDistrict,
                permanentThana: profileUser?.permanentThana,
                permanentCountry: profileUser?.permanentCountry || "Bangladesh",
            });
        }
    }, [profileUser, reset]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (profileUser) {
                    if (profileUser.coverImage) setImages(prev => ({ ...prev, cover: profileUser.coverImage }));
                    if (profileUser.profileImage) setImages(prev => ({ ...prev, avatar: profileUser.profileImage }));
                    if (profileUser.nidStatus) setNidUploaded(profileUser.nidStatus === 'verified' || profileUser.nidStatus === 'pending');
                    setIsProfileLocked(profileUser.isLocked !== undefined ? profileUser.isLocked : true);

                    setIsNidPaid(!!profileUser.isNidPaid);
                    setIsFieldPaid(!!profileUser.isFieldPaid);
                    if (profileUser.fieldStatus) setFieldVerificationStatus(profileUser.fieldStatus);

                    if (profileUser._id) {
                        const res = await axios.get(`${config?.backendUrl}/verification/check-nid/${profileUser._id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.data?.success) {
                            setNidSubmittedDb(res.data.exists);
                            setNidDbStatus(res.data.status || null);
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfileData();
    }, [profileUser, token, config]);

    useEffect(() => {
        if (profileUser) {
            setValue("birth", profileUser.birth || "");
            setValue("Height", profileUser.Height || "");
            setValue("homeDistrict", profileUser.homeDistrict || "");
            setValue("maritalStatus", profileUser.maritalStatus || "");
            setValue("religion", profileUser.religion || "");
            setValue("contactNo", profileUser.contactNo || "");
            setValue("email", profileUser.email || "");
            setValue("currentCountry", profileUser.currentCountry || "Bangladesh");
            setValue("permanentCountry", profileUser.permanentCountry || "Bangladesh");
        }
    }, [profileUser, editSections.personal, editSections.contact, setValue]);

    useEffect(() => {
        if (!profileUser || divisions.length === 0) return;

        if (profileUser.currentDivision) {
            const matchedDiv = divisions.find(d => String(d.name).toLowerCase() === String(profileUser.currentDivision).toLowerCase());
            if (matchedDiv) {
                const curDivId = matchedDiv.id;
                setValue("currentDivision", curDivId);

                const filteredDistricts = allDistricts.filter(d => String(d.division_id) === String(curDivId));
                setCurrentDistricts(filteredDistricts);

                if (profileUser.currentDistrict) {
                    const matchedDist = filteredDistricts.find(d => String(d.name).toLowerCase() === String(profileUser.currentDistrict).toLowerCase());
                    if (matchedDist) {
                        const curDistId = matchedDist.id;
                        setValue("currentDistrict", curDistId);

                        const filteredUpz = allUpazilas.filter(u => String(u.district_id) === String(curDistId));
                        setCurrentUpazilas(filteredUpz);

                        if (profileUser.currentThana) {
                            const matchedUpz = filteredUpz.find(u => String(u.name).toLowerCase() === String(profileUser.currentThana).toLowerCase());
                            if (matchedUpz) setValue("currentThana", matchedUpz.name);
                        }
                    }
                }
            }
        }

        if (profileUser.permanentDivision) {
            const matchedDiv = divisions.find(d => String(d.name).toLowerCase() === String(profileUser.permanentDivision).toLowerCase());
            if (matchedDiv) {
                const permDivId = matchedDiv.id;
                setValue("permanentDivision", permDivId);

                const filteredDistricts = allDistricts.filter(d => String(d.division_id) === String(permDivId));
                setPermanentDistricts(filteredDistricts);

                if (profileUser.permanentDistrict) {
                    const matchedDist = filteredDistricts.find(d => String(d.name).toLowerCase() === String(profileUser.permanentDistrict).toLowerCase());
                    if (matchedDist) {
                        const permDistId = matchedDist.id;
                        setValue("permanentDistrict", permDistId);

                        const filteredUpz = allUpazilas.filter(u => String(u.district_id) === String(permDistId));
                        setPermanentUpazilas(filteredUpz);

                        if (profileUser.permanentThana) {
                            const matchedUpz = filteredUpz.find(u => String(u.name).toLowerCase() === String(profileUser.permanentThana).toLowerCase());
                            if (matchedUpz) setValue("permanentThana", matchedUpz.name);
                        }
                    }
                }
            }
        }
    }, [profileUser, editSections.contact, divisions, allDistricts, allUpazilas, setValue]);

    useEffect(() => {
        if (!watchedCurrentDivision) {
            setCurrentDistricts([]);
            setCurrentUpazilas([]);
            return;
        }
        const filtered = allDistricts.filter(d => String(d.division_id) === String(watchedCurrentDivision));
        setCurrentDistricts(filtered);
    }, [watchedCurrentDivision, allDistricts]);

    useEffect(() => {
        if (!watchedCurrentDistrict) {
            setCurrentUpazilas([]);
            return;
        }
        const filtered = allUpazilas.filter(u => String(u.district_id) === String(watchedCurrentDistrict));
        setCurrentUpazilas(filtered);
    }, [watchedCurrentDistrict, allUpazilas]);

    useEffect(() => {
        if (!watchedPermanentDivision) {
            setPermanentDistricts([]);
            setPermanentUpazilas([]);
            return;
        }
        const filtered = allDistricts.filter(d => String(d.division_id) === String(watchedPermanentDivision));
        setPermanentDistricts(filtered);
    }, [watchedPermanentDivision, allDistricts]);

    useEffect(() => {
        if (!watchedPermanentDistrict) {
            setPermanentUpazilas([]);
            return;
        }
        const filtered = allUpazilas.filter(u => String(u.district_id) === String(watchedPermanentDistrict));
        setPermanentUpazilas(filtered);
    }, [watchedPermanentDistrict, allUpazilas]);

    // const handleImageChange = async (e, type) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const localUrl = URL.createObjectURL(file);
    //     setImages(prev => ({ ...prev, [type]: localUrl }));
    //     const toastId = toast.loading(`Uploading ${type === 'cover' ? 'cover' : 'avatar'} photo...`);
    //     const formData = new FormData();
    //     formData.append('image', file);

    //     try {
    //         const response = await axios.put(`${config?.backendUrl}/user/update-image/${type}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         if (response.data?.success && response.data?.data) {
    //             const updatedUser = response.data.data;
    //             setImages({
    //                 avatar: updatedUser.avatarPhoto || '',
    //                 cover: updatedUser.coverPhoto || ''
    //             });
    //             toast.success(response.data.message || `${type === 'cover' ? 'Cover' : 'Avatar'} photo updated!`, { id: toastId });
    //             refetch();
    //         }
    //     } catch (error) {
    //         toast.error("Failed to upload image", { id: toastId });
    //         setImages(prev => ({
    //             ...prev,
    //             [type]: type === 'cover' ? profileUser?.coverPhoto : profileUser?.avatarPhoto
    //         }));
    //     }
    // };

    const handleNidFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const totalFiles = [...selectedFiles, ...files].slice(0, 2);
        setSelectedFiles(totalFiles);
        const urls = totalFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(urls);
    };

    const removeSelectedNidImage = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedUrls = previewImages.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        setPreviewImages(updatedUrls);
    };

    const handleCancelNidUpload = () => {
        setSelectedFiles([]);
        setPreviewImages([]);
    };

    const handleNidSubmit = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image");
            return;
        }
        setIsSubmittingNid(true);
        const toastId = toast.loading("Uploading NID documents...");
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("nidImages", file);
        });

        try {
            const response = await axios.post(`${config?.backendUrl}/verification/upload-nid`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data?.success) {
                toast.success(response.data.message, { id: toastId });
                setSelectedFiles([]);
                setPreviewImages([]);
                refetch();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to upload NID documents.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmittingNid(false);
        }
    };


    const handleNidPaymentProcess = async () => {
        const toastId = toast.loading("Connecting to PayStation...");
        try {
            const res = await axios.post(`${config?.backendUrl}/nidtransaction/initiate`, {
                userObjectId: profileUser?._id,
                userId: profileUser?.userID,
                amount: 390,
                name: profileUser?.name,
                email: profileUser?.email,
                phone: profileUser?.contactNo,
                originUrl: window.location.origin + window.location.pathname
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.success && res.data?.payment_url) {
                toast.dismiss(toastId);
                window.location.href = res.data.payment_url;
            } else {
                toast.error("Failed to generate payment url", { id: toastId });
            }
        } catch (error) {
            toast.error("NID payment initialization failed.", { id: toastId });
        }
    };

    const handleFieldPaymentProcess = async () => {
        const toastId = toast.loading("Connecting to PayStation...");
        try {
            const res = await axios.post(`${config?.backendUrl}/fieldTransaction/transaction-initiate`, {
                userObjectId: profileUser?._id,
                userId: profileUser?.userID,
                amount: 2340,
                name: profileUser?.name,
                email: profileUser?.email,
                phone: profileUser?.contactNo,
                originUrl: window.location.origin + window.location.pathname
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.success && res.data?.payment_url) {
                toast.dismiss(toastId);
                window.location.href = res.data.payment_url;
            } else {
                toast.error("Failed to generate payment url", { id: toastId });
            }
        } catch (error) {
            toast.error("Field payment initialization failed.", { id: toastId });
        }
    };

    const toggleSection = async (section, state) => {
        if (!state) {
            try {
                const response = await axios.get(`${config?.backendUrl}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                reset(response.data);
            } catch (error) {
                if (profileUser) reset(profileUser);
            }
        }
        setEditSections(prev => ({ ...prev, [section]: state }));
    };

    const onFormSubmit = async (formData, sectionName) => {
        const toastId = toast.loading(`Updating ${sectionName}...`);
        let updatedFormData = { ...formData };

        if (updatedFormData?.currentCountry === "Bangladesh") {
            const currentDivObj = divisions.find(d => String(d.id) === String(updatedFormData?.currentDivision) || String(d._id) === String(updatedFormData?.currentDivision));
            const currentDistObj = currentDistricts.find(d => String(d.id) === String(updatedFormData?.currentDistrict) || String(d._id) === String(updatedFormData?.currentDistrict));
            if (currentDivObj) updatedFormData.currentDivision = currentDivObj.name;
            if (currentDistObj) updatedFormData.currentDistrict = currentDistObj.name;
        }

        if (updatedFormData?.permanentCountry === "Bangladesh") {
            const permDivObj = divisions.find(d => String(d.id) === String(updatedFormData?.permanentDivision) || String(d._id) === String(updatedFormData?.permanentDivision));
            const permDistObj = permanentDistricts.find(d => String(d.id) === String(updatedFormData?.permanentDistrict) || String(d._id) === String(updatedFormData?.permanentDistrict));
            if (permDivObj) updatedFormData.permanentDivision = permDivObj.name;
            if (permDistObj) updatedFormData.permanentDistrict = permDistObj.name;
        }

        try {
            const response = await axios.put(`${config?.backendUrl}/user/update`, updatedFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data?.success) {
                toast.success(`${sectionName} updated successfully!`, { id: toastId });
                setEditSections(prev => ({ ...prev, [sectionName]: false }));
                refetch();
            }
        } catch (error) {
            toast.error("Failed to update.", { id: toastId });
        }
    };

    const [activeTab, setActiveTab] = useState("info");
    const [isMeetupOpen, setIsMeetupOpen] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ y: profileUser?.coverPosition || 0 });
    const [startDrag, setStartDrag] = useState({ y: 0 });
    const [tempImage, setTempImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    console.log(profileUser)

    useEffect(() => {
        if (profileUser && profileUser.coverPosition !== undefined) {
            setPosition({ y: Number(profileUser.coverPosition) });
        }
    }, [profileUser]);

    const handleImageChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'cover') {
            setSelectedFile(file);
            const localUrl = URL.createObjectURL(file);
            setTempImage(localUrl);
            setPosition({ y: 0 });
        } else {
            const toastId = toast.loading('Uploading avatar photo...');
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.put(`${config?.backendUrl}/user/update-image/avatar`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data?.success && response.data?.data) {
                    const updatedUser = response.data.data;
                    setImages({
                        avatar: updatedUser.avatarPhoto || '',
                        cover: updatedUser.coverPhoto || ''
                    });
                    toast.success(response.data.message || 'Avatar photo updated!', { id: toastId });
                    refetch();
                }
            } catch (error) {
                toast.error("Failed to upload image", { id: toastId });
            }
        }
    };

    const handleMouseDown = (e) => {
        if (!tempImage) return;
        setIsDragging(true);
        setStartDrag({ y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !tempImage || !containerRef.current || !imageRef.current) return;

        const containerHeight = containerRef.current.clientHeight;
        const imageHeight = imageRef.current.clientHeight;
        const maxDrag = containerHeight - imageHeight;

        if (maxDrag >= 0) return;

        let newY = e.clientY - startDrag.y;
        if (newY > 0) newY = 0;
        if (newY < maxDrag) newY = maxDrag;

        setPosition({ y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSavePosition = async () => {
        if (!selectedFile) return;
        setIsSaving(true);
        const toastId = toast.loading('Uploading and saving cover photo...');

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('coverPosition', String(position.y));

        try {
            const response = await axios.put(`${config?.backendUrl}/user/update-image/cover`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data?.success && response.data?.data) {
                const updatedUser = response.data.data;
                setImages({
                    avatar: updatedUser.profileImage || updatedUser.avatarPhoto || '',
                    cover: updatedUser.coverImage || updatedUser.coverPhoto || ''
                });
                if (updatedUser.coverPosition !== undefined) {
                    setPosition({ y: Number(updatedUser.coverPosition) });
                }

                toast.success(response.data.message || 'Cover photo updated!', { id: toastId });
                setTempImage(null);
                setSelectedFile(null);
                refetch();
            }
        } catch (error) {
            toast.error("Failed to upload image", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempImage(null);
        setSelectedFile(null);
        setPosition({ y: profileUser?.coverPosition || 0 });
    };


    if (isLoading) {
        return (
            <div>
                <LucideClockFading></LucideClockFading>
            </div>
        );
    }


    return (
        <div className="app-container pb-8 min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="relative mb-6">
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`h-64 md:h-[32rem] w-full rounded-b-2xl overflow-hidden relative select-none ${profileUser?.role === 'PREMIUM' ? 'bg-gradient-to-br from-neutral-950 via-red-950 to-neutral-950 ring-4 ring-red-600 ring-offset-4 ring-offset-neutral-950 shadow-2xl shadow-red-600/30' : 'bg-emerald-950'}`}
                >
                    {tempImage ? (
                        <img
                            ref={imageRef}
                            src={tempImage}
                            style={{ transform: `translateY(${position.y}px)` }}
                            className={`w-full absolute top-0 left-0 object-cover ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                            alt="Reposition Cover"
                            onMouseDown={handleMouseDown}
                            draggable={false}
                        />
                    ) : (
                        images.cover && (
                            <img
                                src={images.cover}
                                // database coordinate validation transformation logic integration here
                                style={{ transform: `translateY(${position.y}px)` }}
                                className="w-full absolute top-0 left-0 object-cover"
                                alt="Cover"
                                draggable={false}
                            />
                        )
                    )}

                    <div className={`absolute inset-0 pointer-events-none ${profileUser?.role === 'PREMIUM' ? 'bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent' : 'bg-gradient-to-t from-black/60 via-transparent to-transparent'}`} />

                    {tempImage ? (
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 bg-black/60 p-1.5 rounded-xl backdrop-blur-sm">
                            <span className="text-xs text-white/90 px-2 font-medium hidden sm:inline">Drag to Position</span>
                            <button
                                onClick={handleSavePosition}
                                disabled={isSaving}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition disabled:opacity-50"
                            >
                                <Check className="w-4 h-4" /> Save
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition disabled:opacity-50"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    ) : (
                        <label className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer transition backdrop-blur-sm z-10">
                            <Camera className="w-4 h-4" /> Edit Cover Photo
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'cover')} />
                        </label>
                    )}

                    {profileUser?.role === 'PREMIUM' && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-red-600/40 flex items-center gap-1.5 border border-red-500/30 z-10">
                            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" /> Premium Member
                        </div>
                    )}
                </div>

                <div className="absolute -bottom-36 sm:-bottom-12 left-4 sm:left-8 flex flex-col sm:flex-row items-center gap-4 z-20 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)]">
                    <div className="relative group flex-shrink-0">
                        <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-neutral-800 relative shadow-xl ${profileUser?.role === 'PREMIUM' ? 'border-4 border-red-600 ring-4 ring-rose-500/40 ring-offset-2' : 'border-4 border-white'}`}>
                            {images.avatar && <img src={images.avatar} className="w-full h-full object-cover rounded-full" alt="Avatar" />}
                            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full">
                                <Camera className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium">Change Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'avatar')} />
                            </label>
                        </div>
                        {profileUser?.nidStatus === 'verified' && (
                            <div className={`absolute bottom-2 right-2 border-2 border-neutral-950 text-white p-1.5 rounded-full shadow-lg ${profileUser?.role === 'PREMIUM' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <div className="mb-4 flex-1 w-full min-w-0 bg-black/70 md:bg-black/40 backdrop-blur-md p-1 md:p-4 rounded-2xl border border-white/10 shadow-lg max-w-xl text-center sm:text-left">
                        {editSections.header ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'header'))} className="space-y-2 min-w-[250px]">
                                <input {...register('fullName')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="Name" />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-red-600 text-white px-2 py-1 text-xs rounded font-medium flex-1">Save</button>
                                    <button type="button" onClick={() => toggleSection('header', false)} className="bg-gray-500 text-white px-2 py-1 text-xs rounded font-medium flex-1">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-start justify-between gap-2 group">
                                <div className="min-w-0 w-full">
                                    <h1 className={`text-2xl sm:text-3xl font-extrabold truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${profileUser?.role === 'PREMIUM' ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-orange-400' : 'text-white'}`}>
                                        {profileUser?.fullName || 'No Name Set'}
                                    </h1>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-2 text-xs sm:text-sm font-medium text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-red-500" /> {profileUser?.currentThana || 'Not Set'}, Bangladesh</span>
                                        <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-red-500" /> <span className="text-gray-400">ID:</span> {profileUser?.profileId || profileUser?.userID || 'N/A'}</span>
                                        <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-red-500" /> <span className="text-gray-400">Referral:</span> {profileUser?.ownRefarelID || 'N/A'}</span>
                                    </div>
                                </div>
                                <button type="button" onClick={() => toggleSection('header', true)} className="p-1.5 bg-neutral-800/80 hover:bg-neutral-700 text-white rounded-xl shadow border border-white/10 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-40 border-b border-gray-200 px-8 md:mt-16">
                <button type="button" onClick={() => setActiveTab("info")} className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === "info" ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                    Profile Info
                </button>
                <button type="button" onClick={() => setActiveTab("photos")} className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === "photos" ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                    Photos
                </button>
            </div>

            <div className="pt-6">
                {activeTab === "info" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                                        <User className="w-5 h-5" /> Personal Information
                                    </h2>
                                    {!editSections.personal && (
                                        <button
                                            type="button"
                                            onClick={() => toggleSection('personal', true)}
                                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {editSections.personal ? (
                                    <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'personal'))} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">AGE</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="YYYY-MM-DD"
                                                    maxLength={10}
                                                    {...register("birth", {
                                                        required: "Date of birth is required",
                                                        validate: value => /^\d{4}-\d{2}-\d{2}$/.test(value) || "Please enter a valid date (YYYY-MM-DD)"
                                                    })}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, "");
                                                        let formatted = "";
                                                        if (val.length > 0) {
                                                            formatted = val.substring(0, 4);
                                                            if (val.length > 4) formatted += "-" + val.substring(4, 6);
                                                            if (val.length > 6) formatted += "-" + val.substring(6, 8);
                                                        }
                                                        e.target.value = formatted;
                                                        register("birth").onChange(e);
                                                    }}
                                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white text-gray-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Height</label>
                                                <input {...register('Height')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                                <input {...register('homeDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Marital Status</label>
                                                <select
                                                    {...register('maritalStatus')}
                                                    className="w-full mt-1 p-2 border rounded-lg text-sm bg-white text-gray-700 outline-none cursor-pointer focus:border-[#C20E0E]"
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Unmarried">Unmarried</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Divorced">Divorced</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Religion</label>
                                                <input {...register('religion')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => toggleSection('personal', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Age</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.age || 'Not Set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Height</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.Height || 'Not Set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.homeDistrict || 'Not Set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Marital Status</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.maritalStatus || 'Not Set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Religion</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.religion || 'Not Set'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><Briefcase className="w-5 h-5" /> Professional & Education</h2>
                                    {!editSections.professional && (
                                        <button type="button" onClick={() => toggleSection('professional', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                                    )}
                                </div>

                                {editSections.professional ? (
                                    <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'professional'))} className="space-y-4">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Profession</label>
                                                <input {...register('profession')} className="w-full mt-1 p-2 border rounded-lg text-sm mb-2 bg-white" placeholder="Profession" />
                                                <input {...register('professionOrganization')} className="w-full p-2 border rounded-lg text-sm bg-white" placeholder="Organization" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Education</label>
                                                <input {...register('education')} className="w-full mt-1 p-2 border rounded-lg text-sm mb-2 bg-white" placeholder="Education" />
                                                <input {...register('institute')} className="w-full p-2 border rounded-lg text-sm bg-white" placeholder="Institution" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => toggleSection('professional', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex gap-3 items-start">
                                            <div className="bg-red-50 p-2 rounded-xl text-red-600 mt-1"><Briefcase className="w-5 h-5" /></div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-semibold">{profileUser?.profession || 'Not Set'}</p>
                                                <p className="text-gray-500 text-sm">{profileUser?.professionOrganization || 'No Organization'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="bg-red-50 p-2 rounded-xl text-red-600 mt-1"><GraduationCap className="w-5 h-5" /></div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-semibold">{profileUser?.education || 'Not Set'}</p>
                                                <p className="text-gray-500 text-sm">{profileUser?.institute || 'No Institution'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" /> Contact & Address
                                    </h2>
                                    {!editSections.contact && (
                                        <button
                                            type="button"
                                            onClick={() => toggleSection('contact', true)}
                                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {!editSections.contact ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><Phone className="w-3.5 h-3.5" /> Contact No</span>
                                                <p className="text-gray-700 text-sm font-medium">{profileUser?.contactNo || 'Not Set'}</p>
                                            </div>
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><Mail className="w-3.5 h-3.5" /> Email Address</span>
                                                <p className="text-gray-700 text-sm font-medium">{profileUser?.email || 'Not Set'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><MapPin className="w-3.5 h-3.5" /> Current Address</span>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {[profileUser?.currentThana, profileUser?.currentDistrict, profileUser?.currentDivision, profileUser?.currentCountry].filter(Boolean).join(", ") || "Not Set"}
                                                </p>
                                            </div>
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><Globe className="w-3.5 h-3.5" /> Permanent Address</span>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {[profileUser?.permanentThana, profileUser?.permanentDistrict, profileUser?.permanentDivision, profileUser?.permanentCountry].filter(Boolean).join(", ") || "Not Set"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'contact'))} className="space-y-4 mt-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Contact No</label>
                                                <input {...register('contactNo')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Email</label>
                                                <input {...register('email')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                            {/* Current Address Form */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-gray-700">Current Address</h3>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">Division</label>
                                                    <select {...register('currentDivision')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                        <option value="">Select Division</option>
                                                        {divisions.map((div) => (
                                                            <option key={div._id || div.id} value={div.id || div._id}>{div.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">District</label>
                                                    <select disabled={!watchedCurrentDivision} {...register('currentDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                        <option value="">Select District</option>
                                                        {currentDistricts.map((dist) => (
                                                            <option key={dist._id || dist.id} value={dist.id || dist._id}>{dist.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">Thana / Upazila</label>
                                                    <select disabled={!watchedCurrentDistrict} {...register('currentThana')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                        <option value="">Select Thana</option>
                                                        {currentUpazilas.map((upz) => (
                                                            <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">Country</label>
                                                    <select {...register('currentCountry')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                        <option value="Bangladesh">Bangladesh</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Permanent Address Form */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-gray-700">Permanent Address</h3>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">Division</label>
                                                    <select {...register('permanentDivision')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                        <option value="">Select Division</option>
                                                        {divisions.map((div) => (
                                                            <option key={div._id || div.id} value={div.id || div._id}>{div.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">District</label>
                                                    <select disabled={!watchedPermanentDivision} {...register('permanentDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                        <option value="">Select District</option>
                                                        {permanentDistricts.map((dist) => (
                                                            <option key={dist._id || dist.id} value={dist.id || dist._id}>{dist.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">Thana / Upazila</label>
                                                    <select disabled={!watchedPermanentDistrict} {...register('permanentThana')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                        <option value="">Select Thana</option>
                                                        {permanentUpazilas.map((upz) => (
                                                            <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 uppercase">Country</label>
                                                    <select {...register('permanentCountry')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                        <option value="Bangladesh">Bangladesh</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => toggleSection('contact', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><Home className="w-5 h-5" /> Family Background</h2>
                                    {!editSections.family && (
                                        <button type="button" onClick={() => toggleSection('family', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                                    )}
                                </div>

                                {editSections.family ? (
                                    <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'family'))} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Father's Occupation</label>
                                                <input {...register('fatherOccupation')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-400 uppercase">Mother's Occupation</label>
                                                <input {...register('motherOccupation')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                            </div>
                                            {/* <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Siblings</label>
                                        <input {...register('siblings')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Family Values</label>
                                        <input {...register('familyValues')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div> */}
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => toggleSection('family', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Father's Occupation</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.fatherOccupation || 'Not Set'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Mother's Occupation</label>
                                            <p className="text-gray-800 font-medium mt-0.5">{profileUser?.motherOccupation || 'Not Set'}</p>
                                        </div>
                                        {/* <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Siblings</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{profileUser?.siblings || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Family Values</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{profileUser?.familyValues || 'Not Set'}</p>
                                </div> */}
                                    </div>
                                )}
                            </div>

                            {/* <div className="bg-red-600 text-white p-6 rounded-2xl shadow-sm relative group">
                                <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
                                    <h2 className="text-lg font-bold flex items-center gap-2"><Heart className="w-5 h-5" /> Partner Expectations</h2>
                                    {!editSections.expectations && (
                                        <button type="button" onClick={() => toggleSection('expectations', true)} className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                                    )}
                                </div>

                                {editSections.expectations ? (
                                    <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'expectations'))} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((num) => (
                                                <div key={num} className="w-full">
                                                    <label className="text-xs font-semibold opacity-80 uppercase">Expectation {num}</label>
                                                    <textarea {...register(`expectation${num}`)} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white text-gray-800" rows={2} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button type="button" onClick={() => toggleSection('expectations', false)} className="px-4 py-2 bg-white/20 text-white rounded-xl text-xs font-medium">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((num) => (
                                            <div key={num} className="flex gap-2 items-start">
                                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-white/80" />
                                                <p className="text-sm font-medium leading-relaxed">{profileUser?.[`expectation${num}`] || 'No expectations added yet.'}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div> */}

                        </div>

                        <div className="space-y-6">
                            {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="mx-auto bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-3"><Heart className="w-6 h-6" /></div>
                        <h3 className="font-bold text-gray-800 text-lg">Connect with {profileUser?.name || 'User'}</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4 px-4">Take the first step toward a blessed journey together.</p>

                        <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition shadow-md shadow-red-100 mb-3 flex items-center justify-center gap-2">
                            <Heart className="w-4 h-4" /> Send Interest
                        </button>

                        {isProfileLocked ? (
                            <button type="button" onClick={handleUnlockProfile} className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" /> Unlock Contact Details
                            </button>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl space-y-2 text-left">
                                <p className="text-xs font-bold flex items-center gap-1 text-emerald-600 uppercase"><Unlock className="w-3.5 h-3.5" /> Contact Unlocked</p>
                                <p className="text-sm"><strong>Phone:</strong> {profileUser?.phone || 'N/A'}</p>
                                <p className="text-sm"><strong>Email:</strong> {profileUser?.email || 'N/A'}</p>
                            </div>
                        )}
                    </div> */}
                            <div className="flex justify-start">
                                <button
                                    onClick={() => setIsMeetupOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-950/50 transition flex items-center gap-2 border border-rose-500/20"
                                >
                                    Fill Up Meet Up Form
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Status</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-500">Profile Progress:</span>
                                            <div className="w-24 bg-yellow-400 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-green-700 h-full transition-all duration-500"
                                                    style={{ width: `${getProfileCompletion()}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-yellow-600">{getProfileCompletion()}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                                {profileUser?.isActive === 'ACTIVE' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-500" />
                                                )}
                                                <span>Profile Activation</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                                {(profileUser?.isDocumentVerification || profileUser?.nidStatus === 'verified') ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                                                ) : profileUser?.nidStatus === 'pending' ? (
                                                    <LucideClockFading className="w-4 h-4 text-amber-500" />
                                                ) : (
                                                    <X className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span>Document Verification</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                                {(profileUser?.isFieldVerification || fieldVerificationStatus === 'VERIFIED') ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                                                ) : fieldVerificationStatus === 'PENDING' ? (
                                                    <LucideClockFading className="w-4 h-4 text-amber-500" />
                                                ) : (
                                                    <X className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span>Field Verification</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Document Verification
                                            </h3>
                                            <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">Attach your National ID Card (NID) to unlock verified badge.</p>
                                        </div>

                                        <div className="mt-auto w-full">
                                            {!isNidPaid ? (
                                                <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-xl text-center">
                                                    <p className="text-xs text-emerald-200 mb-3">Verification Fee: <span className="font-bold text-sm text-white">390 TK</span></p>
                                                    <button
                                                        type="button"
                                                        onClick={handleNidPaymentProcess}
                                                        className="w-full py-2 px-4 rounded-lg bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-2"
                                                    >
                                                        <CreditCard className="w-4 h-4" /> Pay 390 TK
                                                    </button>
                                                </div>
                                            ) : nidSubmittedDb ? (
                                                <>
                                                    {nidDbStatus === "verified" && (
                                                        <div className="bg-emerald-800/40 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                                                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                                            <span className="text-xs font-medium text-emerald-200">Your Identity has been verified successfully.</span>
                                                        </div>
                                                    )}

                                                    {nidDbStatus === "pending" && (
                                                        <div className="bg-amber-800/30 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3">
                                                            <LucideClockFading className="w-5 h-5 text-amber-400 shrink-0" />
                                                            <span className="text-xs font-medium text-amber-200">Documents submitted. Admin reviewing submission.</span>
                                                        </div>
                                                    )}

                                                    {nidDbStatus === "rejected" && (
                                                        <div className="bg-rose-800/30 border border-rose-500/30 p-4 rounded-xl flex items-center gap-3">
                                                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-medium text-rose-200">Submission rejected. Upload valid documentation.</span>
                                                                <button type="button" onClick={() => { setNidSubmittedDb(false); setNidDbStatus(null); }} className="text-xs text-left text-emerald-400 underline hover:text-emerald-300 mt-1">Re-upload Documents</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="bg-emerald-950/80 border border-emerald-500/30 p-3 rounded-xl text-center mb-1">
                                                        <p className="text-[11px] text-emerald-200 font-medium">tmr payment document er jonno successfull hoyeche admin check kore 30 minute er modhe apporve kore dibe</p>
                                                    </div>
                                                    <form onSubmit={handleSubmit(handleNidSubmit)}>
                                                        {previewImages.length === 0 ? (
                                                            <div className="border border-dashed border-emerald-500/50 rounded-xl p-4 bg-emerald-950/40 text-center hover:bg-emerald-950/60 transition cursor-pointer relative">
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept="image/*"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    {...register("nidDocuments", {
                                                                        required: true,
                                                                        onChange: handleNidFileSelect
                                                                    })}
                                                                />
                                                                <Upload className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                                                                <p className="text-xs font-medium text-emerald-300">Upload NID Front & Back</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {previewImages.map((url, index) => (
                                                                        <div key={index} className="relative aspect-[1.6/1] border border-emerald-500/30 rounded-xl overflow-hidden bg-emerald-950/40">
                                                                            <img src={url} alt={`NID Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                                            <button type="button" onClick={() => removeSelectedNidImage(index)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-1 rounded-full text-white transition">
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="flex gap-3 justify-end text-xs font-medium">
                                                                    <button type="button" onClick={handleCancelNidUpload} disabled={isSubmittingNid} className="px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40 transition disabled:opacity-50">
                                                                        Cancel
                                                                    </button>
                                                                    <button type="submit" disabled={isSubmittingNid} className="px-4 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-50">
                                                                        {isSubmittingNid ? "Submitting..." : "Submit Document"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between min-h-[280px]">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-blue-400" /> Field Verification
                                            </h3>
                                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Request on-site structural and background verification checks for full access authority.</p>
                                        </div>

                                        <div className="mt-auto w-full">
                                            {!isFieldPaid ? (
                                                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-center">
                                                    <p className="text-xs text-slate-400 mb-3">Verification Fee: <span className="font-bold text-sm text-white">2340 TK</span></p>
                                                    <button
                                                        type="button"
                                                        onClick={handleFieldPaymentProcess}
                                                        className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition flex items-center justify-center gap-2"
                                                    >
                                                        <Wallet className="w-4 h-4" /> Pay 2340 TK
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl flex items-center gap-3">
                                                        {(profileUser?.isFieldVerification || fieldVerificationStatus === 'VERIFIED') ? (
                                                            <>
                                                                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                                                <span className="text-xs font-medium text-emerald-200">Field Verification Completed.</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LucideClockFading className="w-5 h-5 text-blue-400 shrink-0" />
                                                                <span className="text-xs font-medium text-blue-300">Payment Processed. Field audit queue sequence assigned.</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {fieldVerificationStatus === 'PENDING' && (
                                                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-center">
                                                            <p className="text-[11px] text-slate-300 font-medium">tmr payment document er jonno successfull hoyeche admin check kore 30 minute er modhe apporve kore dibe</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <MeetupModal isOpen={isMeetupOpen} onClose={() => setIsMeetupOpen(false)} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <PhotoGalleryView profileUser={profileUser} token={token} config={config} />
                )}
            </div>


        </div>
    );
};

export default UserProfile;