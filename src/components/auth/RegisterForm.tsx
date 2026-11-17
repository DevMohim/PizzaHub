"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff, ImagePlus, Store, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel } from "@/components/ui/field";

type Role = "customer" | "vendor";

interface RegisterFormProps {
  /** Initial selected role. @default "customer" */
  defaultRole?: Role;
  submitLabel?: string;
  /** Optional submit handler; a placeholder handler is used by default. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const roleOptions: Array<{
  value: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "customer",
    label: "Customer",
    description: "Order pizza",
    icon: <User className="size-4" />,
  },
  {
    value: "vendor",
    label: "Vendor",
    description: "Sell pizza",
    icon: <Store className="size-4" />,
  },
];

/**
 * Reusable registration form.
 * UI only — submit logic is intentionally not implemented yet.
 */
function RegisterForm({
  defaultRole = "customer",
  submitLabel = "Create Account",
  onSubmit,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Local preview only — upload to ImgBB happens on submit later.
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImagePreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setImageFileName(file.name);
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setImageFileName(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Declared only — registration logic will be added later.
  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  const passwordType = showPassword ? "text" : "password";
  const confirmPasswordType = showConfirmPassword ? "text" : "password";

  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-5" noValidate>
      {/* Profile image */}
      <div className="space-y-2">
        <Label htmlFor="profile-image">Profile Image (optional)</Label>
        <Label
          htmlFor="profile-image"
          className={
            imagePreviewUrl
              ? "hover:bg-accent/70 flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-card p-2 transition-colors"
              : "hover:bg-accent/70 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input px-3 py-2.5 text-center transition-colors"
          }
        >
          {imagePreviewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreviewUrl}
                alt="Profile preview"
                className="size-11 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium">
                  {imageFileName}
                </span>
                <span className="text-muted-foreground block text-[11px]">
                  Click to change image
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove selected image"
                onClick={handleRemoveImage}
                className="text-muted-foreground"
              >
                <X />
              </Button>
            </>
          ) : (
            <>
              <ImagePlus className="text-muted-foreground size-4" />
              <span className="text-muted-foreground text-xs">
                Click to upload a JPG, PNG or WEBP
              </span>
            </>
          )}
          <Input
            ref={imageInputRef}
            id="profile-image"
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
        </Label>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label>Register as</Label>
        <RadioGroup name="role" defaultValue={defaultRole} className="grid-cols-2 gap-2">
          {roleOptions.map((role) => (
            <FieldLabel
              key={role.value}
              className="hover:border-primary/50 cursor-pointer flex-row items-center gap-2 rounded-lg border border-input bg-card p-2.5 text-left transition-colors has-data-checked:border-primary has-data-checked:bg-accent"
            >
              <span className="text-primary">{role.icon}</span>
              <span className="space-y-0.5">
                <span className="font-heading block text-xs font-semibold">
                  {role.label}
                </span>
                <span className="text-muted-foreground block text-[11px] leading-none">
                  {role.description}
                </span>
              </span>
              <RadioGroupItem value={role.value} className="sr-only" />
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>

      {/* Full name */}
      <div className="space-y-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input
          id="full-name"
          name="fullName"
          type="text"
          required
          placeholder="e.g. John Doe"
          autoComplete="name"
          className="h-10"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="h-10"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={passwordType}
            required
            placeholder="••••••••"
            autoComplete="new-password"
            className="h-10 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
            className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={confirmPasswordType}
            required
            placeholder="••••••••"
            autoComplete="new-password"
            className="h-10 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="h-10 w-full bg-[image:var(--gradient-primary)] text-white hover:opacity-90"
      >
        {submitLabel}
      </Button>
    </form>
  );
}

export default RegisterForm;
