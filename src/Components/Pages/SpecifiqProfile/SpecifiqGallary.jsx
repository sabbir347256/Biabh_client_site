import axios from "axios";
import { useEffect, useState } from "react";
import config from "../utilies/envconfig";
import toast from "react-hot-toast";
import { ImageIcon, MoreVertical, Trash2, Upload, X } from "lucide-react";

const SpecifiqGallary = ({ profileUser, token }) => {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    const fetchPhotos = async () => {
        if (!profileUser?._id) return;
        try {
            const res = await axios.get(`${config?.backendUrl}/photo-gallery/user/${profileUser._id}`);
            if (res.data?.success) {
                setPhotos(res.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, [profileUser?._id]);

    useEffect(() => {
        const handleOutsideClick = () => setActiveMenu(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Uploading image to gallery...");
        setUploading(true);

        const formData = new FormData();
        formData.append("galleryImage", file);
        formData.append("userObjectId", profileUser?._id);

        try {
            const res = await axios.post(`${config?.backendUrl}/photo-gallery/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data?.success) {
                toast.success("Image uploaded to your gallery!", { id: toastId });
                fetchPhotos();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (photoId, e) => {
        e.stopPropagation();
        const toastId = toast.loading("Deleting image...");
        try {
            const res = await axios.delete(`${config?.backendUrl}/photo-gallery/delete/${photoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success) {
                toast.success("Image removed", { id: toastId });
                setPhotos(prev => prev.filter(p => p._id !== photoId));
                setActiveMenu(null);
            }
        } catch (error) {
            toast.error("Failed to delete image", { id: toastId });
        }
    };

    const toggleMenu = (photoId, e) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === photoId ? null : photoId);
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-600" /> Photo Gallery
                    </h2>
                </div>
                {/* <label className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition shadow-sm">
                    <Upload className="w-4 h-4" /> Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label> */}
            </div>

            {photos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-sm">No photos uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                        <div key={photo._id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border shadow-inner cursor-pointer" onClick={() => setSelectedPhoto(photo.imageUrl)}>
                            <img src={photo.imageUrl} alt="Gallery item" className="w-full h-full object-cover transition duration-300 hover:scale-105" />

                            <div className="absolute top-2 right-2 z-10">
                                <button type="button" onClick={(e) => toggleMenu(photo._id, e)} className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {activeMenu === photo._id && (
                                    <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1" onClick={(e) => e.stopPropagation()}>
                                        <button type="button" onClick={(e) => handleDelete(photo._id, e)} className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition">
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPhoto && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedPhoto(null)}>
                    <button type="button" onClick={() => setSelectedPhoto(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedPhoto} alt="Enlarged view" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecifiqGallary;