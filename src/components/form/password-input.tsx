"use client";

import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PasswordInputsProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInputs({
  disabled = false,
  placeholder,
  value = "",
  onChange,
}: PasswordInputsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e); // Chama onChange se existir
  };

  return (
    <div>
      <Label htmlFor="password" className="mb-1">
        Senha:
      </Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          disabled={disabled}
          placeholder={placeholder ?? "********"}
          value={internalValue}
          onChange={handleChange}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} className="opacity-60" />
          ) : (
            <AiOutlineEye size={20} className="opacity-60" />
          )}
        </button>
      </div>
    </div>
  );
}
