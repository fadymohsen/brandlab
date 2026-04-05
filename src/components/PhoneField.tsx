"use client";

import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PhoneField({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  const isValid = !value || isValidPhoneNumber(value);

  return (
    <div>
      <label className="block text-sm font-medium text-cream/70 mb-1.5">
        {label}
      </label>
      <PhoneInput
        international
        defaultCountry="EG"
        value={value}
        onChange={setValue}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
      />
      {touched && value && !isValid && (
        <p className="text-red-400 text-xs mt-1.5">
          Invalid phone number for the selected country
        </p>
      )}
    </div>
  );
}
