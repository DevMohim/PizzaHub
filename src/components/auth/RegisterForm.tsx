"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ImagePlus, Loader2, Store, User, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel } from "@/components/ui/field";
import { signUp } from "@/lib/auth-client";
import {
  validateAll,
  validateField,
  type FieldName,
  type FormErrors,
} from "@/lib/validation/register";

type Role = "customer" | "vendor";

interface RegisterValues {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  image?: File;
}

interface RegisterFormProps {
  /** Initial selected role. @default "customer" */
  defaultRole?: Role;
  submitLabel?: string;
  /** Optional custom submit handler; the default signs the user up via Better Auth. */
  onSubmit?: (values: RegisterValues) => Promise<void> | void;
}

// /** Uploads a file to ImgBB. Requires NEXT_PUBLIC_IMGBB_API_KEY. */
// async function uploadToImgbb(file: File): Promise<string | undefined> {
//   const apiKey = process.env.IMGBB_API_KEY;
//   if (!apiKey) return undefined;

//   const body = new FormData();
//   body.append("image", file);
//   const response = await fetch(
//     `https://api.imgbb.com/1/upload?key=${apiKey}`,
//     { method: "POST", body }
//   );
//   const result = await response.json();
//   if (!result?.success || !result?.data?.url) {
//     throw new Error("Image upload failed");
//   }
//   return result.data.url as string;
// }

const readValues = (form: HTMLFormElement): Record<FieldName, string> => {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    password: String(data.get("password") ?? ""),
    confirmPassword: String(data.get("confirmPassword") ?? ""),
  };
};

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="text-destructive text-xs">
      {message}
    </p>
  ) : null;

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

function RegisterForm({
  defaultRole = "customer",
  submitLabel = "Create Account",
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Validate a field when the user leaves it.
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;

    const field = event.target.name as FieldName;
    const values = readValues(form);
    const message = validateField(field, values[field], values.password);

    setErrors((prev) => {
      const next = { ...prev, [field]: message };
      // Changing the password also affects the confirm field.
      if (field === "password" && values.confirmPassword) {
        next.confirmPassword = validateField(
          "confirmPassword",
          values.confirmPassword,
          values.password,
        );
      }
      return next;
    });
  };

  // While typing, only update a field that already shows an error.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;

    const field = event.target.name as FieldName;
    if (!errors[field]) return;

    const values = readValues(form);
    const message = validateField(field, values[field], values.password);
    setErrors((prev: FormErrors) => ({ ...prev, [field]: message }));
  };

  // Local preview only — upload to ImgBB happens on submit later.
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const url = URL.createObjectURL(file);

    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleRemoveImage = () => {
    setImage(null);

    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!image) return null;

    const formData = new FormData();

    formData.append("image", image);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.imageUrl) {
      throw new Error(result.message || "Image upload failed");
    }

    return result.imageUrl;
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const values = readValues(form);
    const nextErrors = validateAll(values);

    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0] as FieldName | undefined;
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setLoading(true);

    const roleValue =
      (new FormData(form).get("role") as Role | null) || defaultRole;

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      const imageUrl = await handleImageUpload();

      const { data, error } = await signUp.email({
        ...userData,
        role: roleValue,
        image: imageUrl ?? undefined,
      });

      if (error) {
        toast.error(error.message ?? "Failed to create account");
        throw error;
      }

      if (data) {
        toast.success("Welcome to PizzaHub 🍕");
        router.push("/");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordType = showPassword ? "text" : "password";
  const confirmPasswordType = showConfirmPassword ? "text" : "password";

  const inputClass = (field: FieldName, base: string) =>
    `${base} ${errors[field] ? "border-destructive" : ""}`;

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
                  {image?.name ?? "Selected image"}
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
            name="image"
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
        <RadioGroup
          name="role"
          defaultValue={defaultRole}
          className="grid-cols-2 gap-2"
        >
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
          name="name"
          type="text"
          required
          placeholder="e.g. John Doe"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          onBlur={handleBlur}
          onChange={handleChange}
          className={inputClass("name", "h-10")}
        />
        <FieldError id="name-error" message={errors.name} />
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
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          onBlur={handleBlur}
          onChange={handleChange}
          className={inputClass("email", "h-10")}
        />
        <FieldError id="email-error" message={errors.email} />
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
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            onBlur={handleBlur}
            onChange={handleChange}
            className={inputClass("password", "h-10 pr-10")}
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
        <FieldError id="password-error" message={errors.password} />
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
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            onBlur={handleBlur}
            onChange={handleChange}
            className={inputClass("confirmPassword", "h-10 pr-10")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <FieldError
          id="confirm-password-error"
          message={errors.confirmPassword}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="h-10 w-full bg-(image:--gradient-primary) text-white hover:opacity-90 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Creating account…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}

export default RegisterForm;
