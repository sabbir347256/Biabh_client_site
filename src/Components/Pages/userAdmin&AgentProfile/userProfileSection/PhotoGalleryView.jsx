import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../utilies/envconfig";
import toast from "react-hot-toast";
import { ImageIcon, Trash2, Upload } from "lucide-react";

const PhotoGalleryView = ({ profileUser, token }) => {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);

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

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const toastId = toast.loading("Uploading images to gallery...");
        setUploading(true);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("galleryImages", file);
        });
        formData.append("userObjectId", profileUser?._id);

        try {
            const res = await axios.post(`${config?.backendUrl}/photo-gallery/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data?.success) {
                toast.success("Images uploaded to your gallery!", { id: toastId });
                fetchPhotos();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (photoId) => {
        const toastId = toast.loading("Deleting image...");
        try {
            const res = await axios.delete(`${config?.backendUrl}/photo-gallery/delete/${photoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success) {
                toast.success("Image removed", { id: toastId });
                setPhotos(prev => prev.filter(p => p._id !== photoId));
            }
        } catch (error) {
            toast.error("Failed to delete image", { id: toastId });
        }
    };
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-600" /> Photo Gallery
                    </h2>
                </div>
                <label className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition shadow-sm">
                    <Upload className="w-4 h-4" /> Upload Photos
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
            </div>

            {photos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-sm">No photos uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                        <div key={photo._id} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-50 border shadow-inner">
                            <img src={photo.imageUrl} alt="Gallery item" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <button type="button" onClick={() => handleDelete(photo._id)} className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition transform scale-90 group-hover:scale-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoGalleryView;