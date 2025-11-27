// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Card } from "@/Components/Card"
// import { Upload, ImageIcon, Video, Trash2, AlertCircle } from "lucide-react"
// import Image from "next/image"

// export interface Experience {
//   id: string
//   title: string
//   description: string
//   fileUrl: string
//   fileType: "image" | "video"
//   fileName: string
// }

// interface ExperienceStepProps {
//   experiences: Experience[]
//   onAddExperience: (experience: Omit<Experience, "id">) => void
//   onDeleteExperience: (id: string) => void
//   error?: string
// }

// export function ExperienceStep({ experiences, onAddExperience, onDeleteExperience, error }: ExperienceStepProps) {
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [uploading, setUploading] = useState(false)

//   const handleTitleChange = (value: string) => {
//     const sanitized = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 20)
//     setTitle(sanitized)
//   }

//   const handleDescriptionChange = (value: string) => {
//     const sanitized = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,!?¿¡]/g, "").slice(0, 200)
//     setDescription(sanitized)
//   }

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     const isImage = file.type.startsWith("image/")
//     const isVideo = file.type.startsWith("video/")

//     if (!isImage && !isVideo) {
//       alert("Solo se permiten imágenes o videos")
//       return
//     }

//     if (file.size > 50 * 1024 * 1024) {
//       alert("El archivo es muy grande. Máximo 50MB")
//       return
//     }

//     if (!title.trim()) {
//       alert("Por favor ingresa un título para la experiencia")
//       return
//     }

//     setUploading(true)

//     try {
//       const blobUrl = URL.createObjectURL(file)

//       onAddExperience({
//         title: title.trim(),
//         description: description.trim(),
//         fileUrl: blobUrl,
//         fileType: isImage ? "image" : "video",
//         fileName: file.name,
//       })

//       setTitle("")
//       setDescription("")
//       e.target.value = ""
//     } catch {
//       alert("Error al subir el archivo")
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <Card title="Subir experiencias">
//       <div className="space-y-4">
//         <p className="text-sm text-gray-700 flex items-center gap-2">
//           <Upload className="h-4 w-4 text-primary" />
//           Muestra tus trabajos anteriores subiendo fotos o videos de tus proyectos completados
//         </p>

//         <div className="space-y-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-800">
//               Título del trabajo <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => handleTitleChange(e.target.value)}
//               placeholder="Ej: Instalación eléctrica residencial"
//               maxLength={20}
//               className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
//             />
//             <p className="text-xs text-gray-600">Solo letras, máximo 20 caracteres ({title.length}/20)</p>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-800">Descripción (opcional)</label>
//             <textarea
//               value={description}
//               onChange={(e) => handleDescriptionChange(e.target.value)}
//               placeholder="Describe brevemente el trabajo realizado..."
//               maxLength={200}
//               rows={3}
//               className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
//             />
//             <p className="text-xs text-gray-600">Solo letras y signos de puntuación, máximo 200 caracteres ({description.length}/200)</p>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
//               <ImageIcon className="h-4 w-4 text-primary" />
//               Foto o video <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileUpload}
//               disabled={uploading}
//               className="w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 disabled:opacity-50 transition-all"
//             />
//             <p className="text-xs text-gray-600">Máximo 50MB. Formatos: JPG, PNG, MP4, MOV</p>
//           </div>
//         </div>

//         {experiences.length > 0 && (
//           <div className="space-y-3 animate-fade-in">
//             <h3 className="text-sm font-medium text-gray-800">Experiencias agregadas ({experiences.length})</h3>
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//               {experiences.map((exp) => (
//                 <div
//                   key={exp.id}
//                   className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="absolute top-2 right-2 z-10">
//                     {exp.fileType === "image" ? (
//                       <div className="rounded-full bg-blue-600 p-1.5">
//                         <ImageIcon className="h-3 w-3 text-white" />
//                       </div>
//                     ) : (
//                       <div className="rounded-full bg-purple-600 p-1.5">
//                         <Video className="h-3 w-3 text-white" />
//                       </div>
//                     )}
//                   </div>
//                   {exp.fileType === "image" ? (
//                     <div className="relative h-40">
//                       <Image
//                         src={exp.fileUrl || "/placeholder.svg"}
//                         alt={exp.title}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <video src={exp.fileUrl} className="h-40 w-full object-cover" controls />
//                   )}
//                   <div className="p-3">
//                     <h4 className="font-medium text-gray-900 text-sm">{exp.title}</h4>
//                     {exp.description && <p className="mt-1 text-xs text-gray-600 line-clamp-2">{exp.description}</p>}
//                     <button
//                       type="button"
//                       onClick={() => onDeleteExperience(exp.id)}
//                       className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                       Eliminar
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="flex items-center gap-1 text-sm text-red-600">
//             <AlertCircle className="h-4 w-4" />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>
//     </Card>
//   )
// }
