"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { addIdentity, editIdentity, closeIdentityModal, toggleSection } from "@/store/Slices/identitySlice"
import type { DynamicField } from "@/store/Slices/identitySlice"
import {
  X,
  Plus,
  User,
  MapPin,
  Phone,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Upload,
  Trash2,
  AlertCircle,
  FileText,
  Paperclip,
} from "lucide-react"
import VaultDropdown from "./VaultDropdown"
import { useVaults } from "@/useContext/VaultContext"

const IdentityModalUIOnly = () => {
  const dispatch = useDispatch()
     const { vaults } = useVaults();
  const {
    isModalOpen,
    modalMode,
    editIdentity: identity,
    expandedSections,
  } = useSelector((state: RootState) => state.identity)
  const identities = useSelector((state: RootState) => state.identity.identities);
  console.log(identities, "identities");
  const [selectedTab, setSelectedTab] = useState(vaults[0]?.key || "");
  useEffect(() => {
    console.log(identities, "identities");
  }, [identities])

  const isEdit = modalMode === "edit"
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")

  // Personal details
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [nationality, setNationality] = useState("")

  // Address details
  const [organization, setOrganization] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")

  // Contact details
  const [homePhone, setHomePhone] = useState("")
  const [workPhone, setWorkPhone] = useState("")
  const [mobilePhone, setMobilePhone] = useState("")
  const [alternateEmail, setAlternateEmail] = useState("")
  const [website, setWebsite] = useState("")

  // Work details
  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [workAddress, setWorkAddress] = useState("")
  const [workEmail, setWorkEmail] = useState("")
  const [workPhoneNumber, setWorkPhoneNumber] = useState("")

  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [attachments, setAttachments] = useState<File[]>([])
  const [errors, setErrors] = useState({ title: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setTitle("")
    setNote("")
    setFullName("")
    setEmail("")
    setPhoneNumber("")
    setDateOfBirth("")
    setGender("")
    setNationality("")
    setOrganization("")
    setStreetAddress("")
    setZipCode("")
    setCity("")
    setState("")
    setCountry("")
    setHomePhone("")
    setWorkPhone("")
    setMobilePhone("")
    setAlternateEmail("")
    setWebsite("")
    setCompany("")
    setJobTitle("")
    setDepartment("")
    setWorkAddress("")
    setWorkEmail("")
    setWorkPhoneNumber("")
    setDynamicFields([])
    setAttachments([])
    setErrors({ title: false })
    setIsSubmitting(false)
  }

  // useEffect(() => {
  //   if (isEdit && identity) {
  //     setTitle(identity.title || "")
  //     setNote(identity.note || "")
  //     setFullName(identity.personalDetails.fullName || "")
  //     setEmail(identity.personalDetails.email || "")
  //     setPhoneNumber(identity.personalDetails.phoneNumber || "")
  //     setDateOfBirth(identity.personalDetails.dateOfBirth || "")
  //     setGender(identity.personalDetails.gender || "")
  //     setNationality(identity.personalDetails.nationality || "")
  //     setOrganization(identity.addressDetails.organization || "")
  //     setStreetAddress(identity.addressDetails.streetAddress || "")
  //     setZipCode(identity.addressDetails.zipCode || "")
  //     setCity(identity.addressDetails.city || "")
  //     setState(identity.addressDetails.state || "")
  //     setCountry(identity.addressDetails.country || "")
  //     setHomePhone(identity.contactDetails.homePhone || "")
  //     setWorkPhone(identity.contactDetails.workPhone || "")
  //     setMobilePhone(identity.contactDetails.mobilePhone || "")
  //     setAlternateEmail(identity.contactDetails.alternateEmail || "")
  //     setWebsite(identity.contactDetails.website || "")
  //     setCompany(identity.workDetails.company || "")
  //     setJobTitle(identity.workDetails.jobTitle || "")
  //     setDepartment(identity.workDetails.department || "")
  //     setWorkAddress(identity.workDetails.workAddress || "")
  //     setWorkEmail(identity.workDetails.workEmail || "")
  //     setWorkPhoneNumber(identity.workDetails.workPhone || "")
  //     setDynamicFields(identity.dynamicFields || [])
  //   } else {
  //     resetForm()
  //   }
  // }, [isEdit, identity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setErrors({ ...errors, title: true })
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

 const selectedVault = vaults.find((v) => v.key === selectedTab);

    const payload = {
      title: title.trim(),
      personalDetails: {
        fullName,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        nationality,
      },
      addressDetails: {
        organization,
        streetAddress,
        zipCode,
        city,
        state,
        country,
      },
      contactDetails: {
        homePhone,
        workPhone,
        mobilePhone,
        alternateEmail,
        website,
      },
      workDetails: {
        company,
        jobTitle,
        department,
        workAddress,
        workEmail,
        workPhone: workPhoneNumber,
      },
      dynamicFields,
      attachments: attachments.map((file) => file.name),
      note,
      vaultKey: selectedTab,
      vaultName: selectedVault?.name || "",
      // Optional extras:
      vaultIcon: selectedVault?.icon || "",
      vaultColor: selectedVault?.color || "",
    }

    if (isEdit && identity) {
      dispatch(editIdentity({ id: identity.id, updates: payload }))
    } else {
      dispatch(addIdentity(payload))
    }

    dispatch(closeIdentityModal())
    resetForm()
  }

  const addDynamicField = (section: DynamicField["section"]) => {
    const newField: DynamicField = {
      id: Date.now().toString(),
      type: "text",
      label: "Custom Field",
      value: "",
      section,
    }
    setDynamicFields([...dynamicFields, newField])
  }

  const updateDynamicField = (id: string, value: string) => {
    setDynamicFields((fields) => fields.map((field) => (field.id === id ? { ...field, value } : field)))
  }

  const removeDynamicField = (id: string) => {
    setDynamicFields((fields) => fields.filter((field) => field.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setAttachments((prev) => [...prev, ...files])
  }

  const toggleSectionHandler = (section: keyof typeof expandedSections) => {
    dispatch(toggleSection(section))
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="fixed inset-0" onClick={() => dispatch(closeIdentityModal())} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEdit ? "Edit Identity" : "Create Identity"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEdit ? "Update identity information" : "Store personal and professional details"}
              </p>
            </div>
          <VaultDropdown
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          </div>
          <button
            onClick={() => dispatch(closeIdentityModal())}
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] thin-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Section */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setErrors({ ...errors, title: false })
                }}
                placeholder="Untitled"
                className={`w-full h-11 px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Title is required
                </div>
              )}
            </div>

            {/* Personal Details Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSectionHandler("personal")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  Personal details
                </div>
                {expandedSections.personal ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.personal && (
                <div className="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone number"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => addDynamicField("personal")}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      Add more
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Address Details Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSectionHandler("address")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  Address details
                </div>
                {expandedSections.address ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.address && (
                <div className="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Name"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Street address, P.O. box
                      </label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Street address"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ZIP or Postal code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="ZIP or Postal code"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State or province</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State or province"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country or Region</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country or Region"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Details Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSectionHandler("contact")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  Contact details
                </div>
                {expandedSections.contact ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.contact && (
                <div className="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Home Phone</label>
                      <input
                        type="tel"
                        value={homePhone}
                        onChange={(e) => setHomePhone(e.target.value)}
                        placeholder="Home phone"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Phone</label>
                      <input
                        type="tel"
                        value={workPhone}
                        onChange={(e) => setWorkPhone(e.target.value)}
                        placeholder="Work phone"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Phone</label>
                      <input
                        type="tel"
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                        placeholder="Mobile phone"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alternate Email</label>
                      <input
                        type="email"
                        value={alternateEmail}
                        onChange={(e) => setAlternateEmail(e.target.value)}
                        placeholder="Alternate email"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Work Details Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSectionHandler("work")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Briefcase className="h-4 w-4" />
                  Work details
                </div>
                {expandedSections.work ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.work && (
                <div className="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company name"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Job title"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Department"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Email</label>
                      <input
                        type="email"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="Work email"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Address</label>
                      <input
                        type="text"
                        value={workAddress}
                        onChange={(e) => setWorkAddress(e.target.value)}
                        placeholder="Work address"
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Fields */}
            {dynamicFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                  <button
                    type="button"
                    onClick={() => removeDynamicField(field.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => updateDynamicField(field.id, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>
            ))}

            {/* Add Section Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => addDynamicField("other")}
                className="flex items-center gap-2 px-6 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add section
              </button>
            </div>

            {/* Attachments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Paperclip className="h-4 w-4 text-gray-500" />
                Attachments
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload files from your device.</p>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg p-8 text-center bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-purple-700 dark:text-purple-300 font-medium">Choose a file or drag it here</p>
              </div>

              <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label
                htmlFor="note"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <FileText className="h-4 w-4 text-gray-500" />
                Note
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white resize-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end flex-col-reverse sm:flex-row gap-3 pt-6 pb-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                type="button"
                onClick={() => dispatch(closeIdentityModal())}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none h-11 px-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </div>
                ) : isEdit ? (
                  "Update Identity"
                ) : (
                  "Create Identity"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default IdentityModalUIOnly
