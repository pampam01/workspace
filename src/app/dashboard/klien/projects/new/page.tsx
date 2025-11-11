"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Users,
  Target,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const categories = [
  "Batik",
  "Keramik",
  "Fashion",
  "Desain",
  "Fotografi",
  "Musik",
  "Coding",
  "Kerajinan",
];

const skills = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "CorelDRAW",
  "Sketch",
  "Figma",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "Photography",
  "Videography",
  "Video Editing",
  "Motion Graphics",
  "Batik Tulis",
  "Batik Cap",
  "Natural Dyes",
  "Weaving",
  "Ceramic Art",
  "Pottery",
  "Sculpture",
  "Wood Carving",
  "Fashion Design",
  "Pattern Making",
  "Sewing",
  "Embroidery",
  "Music Production",
  "Sound Engineering",
  "Composition",
  "Arrangement",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    category: "",
    budgetType: "FIXED",
    budget: "",
    budgetMin: "",
    budgetMax: "",
    hourlyRate: "",

    // Timeline
    startDate: "",
    deadline: "",
    estimatedDuration: "",

    // Requirements
    requiredSkills: [] as string[],
    attachments: [] as File[],
    clientNotes: "",

    // Hiring Options
    hiringType: "OPEN", // OPEN or DIRECT
  });

  const [skillInput, setSkillInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill],
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) {
      newErrors.push("Judul proyek harus diisi");
    }

    if (!formData.description.trim()) {
      newErrors.push("Deskripsi proyek harus diisi");
    }

    if (!formData.category) {
      newErrors.push("Kategori harus dipilih");
    }

    if (formData.budgetType === "FIXED" && !formData.budget) {
      newErrors.push("Budget harus diisi untuk proyek fixed price");
    }

    if (formData.budgetType === "HOURLY" && !formData.hourlyRate) {
      newErrors.push("Tarif per jam harus diisi untuk proyek hourly");
    }

    if (!formData.deadline) {
      newErrors.push("Deadline harus ditentukan");
    }

    const deadline = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadline <= today) {
      newErrors.push("Deadline harus di masa depan");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/klien/projects");
      }, 2000);
    } catch (error) {
      setErrors([
        "Terjadi kesalahan saat menyimpan proyek. Silakan coba lagi.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async () => {
    setIsLoading(true);
    try {
      // Simulasi save draft
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Draft berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan draft");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">
              Proyek Berhasil Diposting!
            </CardTitle>
            <CardDescription>
              Proyek Anda telah diposting dan siap menerima proposal dari
              seniman.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/klien/projects">
              <Button>Lihat Proyek Saya</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Kiri - Logo & Link balik */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">
                  ArtisanHub
                </span>
              </Link>

              <Link
                href="/dashboard/klien/projects"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Proyek
              </Link>
            </div>

            {/* Kanan - Tombol */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Draft
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Posting Proyek Baru
          </h1>
          <p className="text-gray-600">
            Buat proyek baru dan temukan seniman berbakat untuk mengerjakannya
          </p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
              <TabsTrigger value="budget">Budget & Timeline</TabsTrigger>
              <TabsTrigger value="requirements">Persyaratan</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informasi Dasar Proyek
                  </CardTitle>
                  <CardDescription>
                    Berikan informasi yang jelas tentang proyek Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Proyek *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Contoh: Desain Logo untuk Startup Teknologi"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori proyek" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Proyek *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Jelaskan secara detail tentang proyek Anda, apa yang perlu dikerjakan, dan hasil yang diharapkan..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Minimal 50 karakter. Deskripsi yang detail akan menarik
                      lebih banyak seniman yang berkualitas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipe Perekrutan</Label>
                    <Select
                      value={formData.hiringType}
                      onValueChange={(value) =>
                        handleSelectChange("hiringType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">
                          Buka untuk Semua Seniman
                        </SelectItem>
                        <SelectItem value="DIRECT">
                          Langsung ke Seniman Tertentu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      {formData.hiringType === "OPEN"
                        ? "Semua seniman dapat melihat dan mengirim proposal"
                        : "Hanya seniman yang Anda undang yang dapat melihat proyek"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Budget & Timeline */}
            <TabsContent value="budget" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget Proyek
                  </CardTitle>
                  <CardDescription>
                    Tentukan budget dan timeline untuk proyek Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tipe Budget *</Label>
                    <Select
                      value={formData.budgetType}
                      onValueChange={(value) =>
                        handleSelectChange("budgetType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIXED">Harga Fix</SelectItem>
                        <SelectItem value="HOURLY">Per Jam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.budgetType === "FIXED" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Proyek (Rp) *</Label>
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          placeholder="5000000"
                          value={formData.budget}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-sm text-gray-500">
                          Budget total untuk seluruh proyek
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budgetMin">
                            Budget Minimal (Opsional)
                          </Label>
                          <Input
                            id="budgetMin"
                            name="budgetMin"
                            type="number"
                            placeholder="3000000"
                            value={formData.budgetMin}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budgetMax">
                            Budget Maksimal (Opsional)
                          </Label>
                          <Input
                            id="budgetMax"
                            name="budgetMax"
                            type="number"
                            placeholder="7000000"
                            value={formData.budgetMax}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Tarif per Jam (Rp) *</Label>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        placeholder="150000"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Tarif yang akan dibayarkan per jam kerja
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline Proyek
                  </CardTitle>
                  <CardDescription>
                    Tentukan jadwal untuk proyek Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Tanggal Mulai (Opsional)
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline *</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">
                      Estimasi Durasi (Hari)
                    </Label>
                    <Input
                      id="estimatedDuration"
                      name="estimatedDuration"
                      type="number"
                      placeholder="30"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">
                      Perkiraan berapa hari proyek akan selesai
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Requirements */}
            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Persyaratan & Keahlian
                  </CardTitle>
                  <CardDescription>
                    Tentukan keahlian yang dibutuhkan untuk proyek ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Keahlian yang Dibutuhkan</Label>
                    <div className="flex gap-2">
                      <Select value={skillInput} onValueChange={setSkillInput}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Cari atau pilih keahlian" />
                        </SelectTrigger>
                        <SelectContent>
                          {skills
                            .filter(
                              (skill) =>
                                !formData.requiredSkills.includes(skill)
                            )
                            .map((skill) => (
                              <SelectItem key={skill} value={skill}>
                                {skill}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={() => addSkill(skillInput)}
                        disabled={
                          !skillInput ||
                          formData.requiredSkills.includes(skillInput)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {formData.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.requiredSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientNotes">
                      Catatan Tambahan untuk Seniman
                    </Label>
                    <Textarea
                      id="clientNotes"
                      name="clientNotes"
                      placeholder="Informasi tambahan yang perlu diketahui seniman..."
                      value={formData.clientNotes}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Lampiran
                  </CardTitle>
                  <CardDescription>
                    Upload file pendukung untuk proyek (referensi, brief, dll)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Drag & drop file di sini atau klik untuk browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      Pilih File
                    </Button>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>File yang Diupload</Label>
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review */}
            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review Proyek
                  </CardTitle>
                  <CardDescription>
                    Periksa kembali detail proyek sebelum memposting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Informasi Dasar</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Judul:</span>{" "}
                          {formData.title || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Kategori:</span>{" "}
                          {formData.category || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Deskripsi:</span>{" "}
                          {formData.description || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Tipe Perekrutan:</span>{" "}
                          {formData.hiringType === "OPEN"
                            ? "Buka untuk Semua"
                            : "Langsung"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Budget & Timeline</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Tipe Budget:</span>{" "}
                          {formData.budgetType === "FIXED"
                            ? "Harga Fix"
                            : "Per Jam"}
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span>
                          {formData.budgetType === "FIXED"
                            ? ` Rp ${parseInt(
                                formData.budget || "0"
                              ).toLocaleString("id-ID")}`
                            : ` Rp ${parseInt(
                                formData.hourlyRate || "0"
                              ).toLocaleString("id-ID")}/jam`}
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>{" "}
                          {formData.deadline || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Durasi:</span>{" "}
                          {formData.estimatedDuration
                            ? `${formData.estimatedDuration} hari`
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.requiredSkills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        Keahlian yang Dibutuhkan
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.attachments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Lampiran</h3>
                      <div className="space-y-1">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Pastikan semua informasi sudah benar. Proyek yang sudah
                      diposting dapat diedited namun perubahan signifikan
                      memerlukan persetujuan ulang dari seniman yang sudah
                      mengirim proposal.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setActiveTab(
                    activeTab === "basic"
                      ? "basic"
                      : activeTab === "budget"
                      ? "basic"
                      : activeTab === "requirements"
                      ? "budget"
                      : "requirements"
                  )
                }
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setActiveTab(
                    activeTab === "basic"
                      ? "budget"
                      : activeTab === "budget"
                      ? "requirements"
                      : activeTab === "requirements"
                      ? "review"
                      : "review"
                  )
                }
                disabled={activeTab === "review"}
              >
                Selanjutnya
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>

            {activeTab === "review" && (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Memposting..." : "Posting Proyek"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
