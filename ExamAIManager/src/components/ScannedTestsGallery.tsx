import { useState, useEffect } from 'react';
import {
    Download, Eye, Search, Grid, List, FileText, Calendar, X, ArrowRight, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { Exam } from '../utils/types';
import ExamService from '../services/examService';
import "../stylies/ScannedTestsGallery.css"
import ExamUploadService from '../services/ExamUploadService';
const ScannedTestsGallery = () => {
    const [selectedImage, setSelectedImage] = useState<Exam | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [testImages, setTestImages] = useState<Exam[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [modalZoom, setModalZoom] = useState(1);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const init = async () => {
        setIsLoading(true);
        try {
            const exams1 = await ExamService.getAll();
            const exams = exams1.map((exam: Exam) => ({
                ...exam,
                created_at: exam.created_at!.split('T')[0]
            }));

            setTestImages(exams);
            console.log('exams', exams);
            const subjectsList: string[] = Array.from(
                new Set(exams.map((img: { subject: string; }) => String(img.subject)))
            );
            setSubjects(['all', ...subjectsList]);

            const urlMap: Record<string, string> = {};
            await Promise.all(exams.map(async (exam: Exam) => {
                if (exam.file_Url) {
                    const url = await ExamUploadService.getUrl(exam.file_Url);
                    if (exam.id) {
                        urlMap[exam.id] = url;
                    }
                }
            }));
            setImageUrls(urlMap);
        } catch (error) {
            console.error('Error loading exams:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadImage = async (imageUrl: string, filename: string) => {
        const url = await ExamUploadService.getUrl(imageUrl);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    const filteredImages = testImages.filter(img => {
        const matchesSearch =
            img.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            img.dateExam?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === 'all' || img.subject === filterBy;
        return matchesSearch && matchesFilter;
    });

    const openModal = (image: Exam) => {
        setSelectedImage(image);
        setModalZoom(1);
        setModalPosition({ x: 0, y: 0 });
    };

    const closeModal = () => {
        setSelectedImage(null);
        setModalZoom(1);
        setModalPosition({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
        setModalZoom(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setModalZoom(prev => Math.max(prev - 0.5, 0.5));
    };

    const resetZoom = () => {
        setModalZoom(1);
        setModalPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (modalZoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - modalPosition.x,
                y: e.clientY - modalPosition.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && modalZoom > 1) {
            setModalPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        init();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (selectedImage) {
                if (e.key === '+' || e.key === '=') handleZoomIn();
                if (e.key === '-') handleZoomOut();
                if (e.key === 'r' || e.key === 'R') resetZoom();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    if (isLoading) {
        return (
            <div className="gallery-container">
                <div className="glass-background"></div>
                <div className="loading-container">
                    <div className="loading-animation">
                        <div className="loading-spinner"></div>
                        <div className="loading-particles">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="particle" style={{ '--i': i } as any}></div>
                            ))}
                        </div>
                    </div>
                    <h2 className="loading-text">Loading tests...</h2>
                    <div className="loading-progress">
                        <div className="progress-bar"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-container">
            <div className="glass-background"></div>

            <header className="gallery-header">
                <div className="header-content">
                    <h1 className="main-title">
                        <FileText className="title-icon" />
                        Scanned Test Gallery
                    </h1>
                    <p className="subtitle">View, download and search your tests easily</p>
                </div>
            </header>

            <div className="controls-section">
                <div className="glass-card controls-card">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="      Search for a test or a profession..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-container">
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="filter-select"
                        >
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>
                                    {subject === 'all' ? 'All the Subjects' : subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <div className={`gallery-grid ${viewMode}`}>
                {filteredImages.map((image, index) => (
                    <div
                        key={image.id}
                        className="test-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="card-image-container">
                            <img
                                src={image.id ? imageUrls[image.id] : ''}
                                alt={image.dateExam}
                                className="card-image"
                                loading="lazy"
                            />
                            <div className="image-overlay">
                                <button
                                    onClick={() => openModal(image)}
                                    className="overlay-btn view-btn-overlay"
                                >
                                    <Eye size={20} />
                                </button>
                                <button
                                    onClick={() => downloadImage(image.file_Url!, `${image.dateExam}.jpg`)}
                                    className="overlay-btn download-btn"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="card-content">
                            <h3 className="card-title">{image.dateExam}</h3>
                            <div className="card-meta">
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    <span>{image.created_at}</span>
                                </div>
                            </div>
                            <div className="subject-tag">
                                {image.subject}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredImages.length === 0 && (
                <div className="no-results">
                    <FileText size={64} className="no-results-icon" />
                    <h3>No tests found</h3>
                    <p>Try changing the filter or search</p>
                </div>
            )}

            {/* Enhanced Modal */}
            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="modal-header">
                            <button className="back-btn" onClick={closeModal}>
                                <ArrowRight size={20} />
                                <span>Back to gallery</span>
                            </button>

                            <div className="modal-controls">
                                <button className="modal-control-btn" onClick={handleZoomOut} disabled={modalZoom <= 0.5}>
                                    <ZoomOut size={18} />
                                </button>
                                <span className="zoom-level">{Math.round(modalZoom * 100)}%</span>
                                <button className="modal-control-btn" onClick={handleZoomIn} disabled={modalZoom >= 3}>
                                    <ZoomIn size={18} />
                                </button>
                                <button className="modal-control-btn" onClick={resetZoom}>
                                    <RotateCcw size={18} />
                                </button>
                                <button className="close-modal-btn" onClick={closeModal}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Image Container */}
                        <div
                            className="modal-image-container"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <img
                                src={selectedImage.id ? imageUrls[selectedImage.id] : ''}
                                alt={selectedImage.subject}
                                className="modal-image"
                                style={{
                                    transform: `scale(${modalZoom}) translate(${modalPosition.x / modalZoom}px, ${modalPosition.y / modalZoom}px)`,
                                    cursor: modalZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                }}
                                draggable={false}
                            />
                        </div>

                        {/* Modal Details */}
                        <div className="modal-details">
                            <h2>{selectedImage.dateExam}</h2>
                            <div className="modal-info">
                                <div className="info-item">
                                    <Calendar size={16} />
                                    <span>Created on: {selectedImage.created_at}</span>
                                </div>
                                <div className="info-item">
                                    <FileText size={16} />
                                    <span>Subject: {selectedImage.subject}</span>
                                </div>
                            </div>
                            <button
                                className="download-full-btn"
                                onClick={() => downloadImage(selectedImage.file_Url!, `${selectedImage.dateExam}.jpg`)}
                            >
                                <Download size={16} />
                                Download test
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScannedTestsGallery;