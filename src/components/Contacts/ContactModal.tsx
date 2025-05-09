import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Upload, Camera } from 'lucide-react';
import { Card } from '../ui/card';
import { ContactFormData } from '../../types/contacts';

interface ContactModalProps {
  onClose: () => void;
  onSave: (contact: ContactFormData, createAnother: boolean) => Promise<void>;
}

export default function ContactModal({ onClose, onSave }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    type: 'lead',
    status: 'active',
    tags: [],
    custom_fields: {
      timezone: ''
    },
    dnd_settings: {
      all: false,
      sms: false,
      calls: false
    }
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const input = document.getElementById('first_name');
    if (input) input.focus();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const validateImage = (file: File): boolean => {
    setImageError(null);

    if (file.size > 2.5 * 1024 * 1024) {
      setImageError('Image size must be less than 2.5MB');
      return false;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('File must be an image');
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateImage(file)) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setProfilePicture(file);

      const img = new Image();
      img.onload = () => {
        if (img.width !== 512 || img.height !== 512) {
          setImageError('Image dimensions must be 512x512 pixels');
          setProfilePicture(null);
          setPreviewUrl(null);
          URL.revokeObjectURL(preview);
        }
      };
      img.src = preview;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'Required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (createAnother: boolean) => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      await onSave(
        {
          ...formData,
          custom_fields: {
            ...formData.custom_fields,
            additional_emails: additionalEmails,
            additional_phones: additionalPhones,
            profile_picture: profilePicture ? await convertImageToBase64(profilePicture) : undefined
          }
        },
        createAnother
      );

      if (createAnother) {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          type: 'lead',
          status: 'active',
          tags: [],
          custom_fields: {
            timezone: ''
          },
          dnd_settings: {
            all: false,
            sms: false,
            calls: false
          }
        });
        setProfilePicture(null);
        setPreviewUrl(null);
        setAdditionalEmails([]);
        setAdditionalPhones([]);
        setErrors({});
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Plus size={32} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Personal Logo</span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Upload size={16} className="text-gray-600" />
                </label>
              </div>
            </div>
            {imageError && (
              <p className="text-center text-sm text-red-500 mt-2">{imageError}</p>
            )}
            <p className="text-center text-sm text-gray-500 mt-2">
              The proposed size is 512*512px no bigger than 2.5mb
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className={`w-full rounded-md ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="First Name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className={`w-full rounded-md ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Last Name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="space-y-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email 1"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}

                {additionalEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...additionalEmails];
                        newEmails[index] = e.target.value;
                        setAdditionalEmails(newEmails);
                      }}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder={`Email ${index + 2}`}
                    />
                    <button
                      onClick={() => setAdditionalEmails(emails => emails.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => setAdditionalEmails([...additionalEmails, ''])}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Add email
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select className="w-24 rounded-md border-gray-300">
                    <option>Select</option>
                    <option>Mobile</option>
                    <option>Work</option>
                    <option>Home</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`flex-1 rounded-md ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Phone 1ct"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}

                {additionalPhones.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <select className="w-24 rounded-md border-gray-300">
                      <option>Select</option>
                      <option>Mobile</option>
                      <option>Work</option>
                      <option>Home</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...additionalPhones];
                        newPhones[index] = e.target.value;
                        setAdditionalPhones(newPhones);
                      }}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder={`Phone ${index + 2}ct`}
                    />
                    <button
                      onClick={() => setAdditionalPhones(phones => phones.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => setAdditionalPhones([...additionalPhones, ''])}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Add Phone Numbers
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const type = e.target.value as 'lead' | 'customer';
                  setFormData({ ...formData, type, tags: [type] });
                }}
                className="w-full rounded-md border-gray-300"
              >
                <option value="lead">Lead</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select
                value={formData.custom_fields.timezone}
                onChange={(e) => setFormData({
                  ...formData,
                  custom_fields: { ...formData.custom_fields, timezone: e.target.value }
                })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="">Choose one...</option>
                <optgroup label="US & Canada">
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Anchorage">Alaska Time (AKT)</option>
                  <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Europe/Berlin">Berlin (CET)</option>
                  <option value="Europe/Madrid">Madrid (CET)</option>
                  <option value="Europe/Rome">Rome (CET)</option>
                  <option value="Europe/Amsterdam">Amsterdam (CET)</option>
                  <option value="Europe/Brussels">Brussels (CET)</option>
                  <option value="Europe/Vienna">Vienna (CET)</option>
                  <option value="Europe/Stockholm">Stockholm (CET)</option>
                  <option value="Europe/Oslo">Oslo (CET)</option>
                  <option value="Europe/Copenhagen">Copenhagen (CET)</option>
                  <option value="Europe/Helsinki">Helsinki (EET)</option>
                  <option value="Europe/Athens">Athens (EET)</option>
                  <option value="Europe/Moscow">Moscow (MSK)</option>
                </optgroup>
                <optgroup label="Asia">
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Mumbai">Mumbai (IST)</option>
                  <option value="Asia/Kolkata">Kolkata (IST)</option>
                  <option value="Asia/Bangkok">Bangkok (ICT)</option>
                  <option value="Asia/Singapore">Singapore (SGT)</option>
                  <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Seoul">Seoul (KST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="Asia/Manila">Manila (PHT)</option>
                  <option value="Asia/Jakarta">Jakarta (WIB)</option>
                </optgroup>
                <optgroup label="Australia & Pacific">
                  <option value="Australia/Perth">Perth (AWST)</option>
                  <option value="Australia/Adelaide">Adelaide (ACST)</option>
                  <option value="Australia/Darwin">Darwin (ACST)</option>
                  <option value="Australia/Brisbane">Brisbane (AEST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                  <option value="Australia/Melbourne">Melbourne (AEST)</option>
                  <option value="Pacific/Auckland">Auckland (NZST)</option>
                  <option value="Pacific/Fiji">Fiji (FJT)</option>
                </optgroup>
                <optgroup label="South America">
                  <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                  <option value="America/Buenos_Aires">Buenos Aires (ART)</option>
                  <option value="America/Santiago">Santiago (CLT)</option>
                  <option value="America/Lima">Lima (PET)</option>
                  <option value="America/Bogota">Bogota (COT)</option>
                  <option value="America/Caracas">Caracas (VET)</option>
                </optgroup>
                <optgroup label="Africa">
                  <option value="Africa/Cairo">Cairo (EET)</option>
                  <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                  <option value="Africa/Nairobi">Nairobi (EAT)</option>
                  <option value="Africa/Lagos">Lagos (WAT)</option>
                  <option value="Africa/Casablanca">Casablanca (WET)</option>
                </optgroup>
                <optgroup label="Atlantic">
                  <option value="Atlantic/Azores">Azores (AZOT)</option>
                  <option value="Atlantic/Cape_Verde">Cape Verde (CVT)</option>
                  <option value="Atlantic/Reykjavik">Reykjavik (GMT)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Save & New
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Save & Close</span>
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}