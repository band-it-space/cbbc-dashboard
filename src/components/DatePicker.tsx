import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";
import { shouldDisableDate } from "@/lib/dateUtils";

/**
 * Компонент для выбора даты с отключенными выходными днями
 *
 * Логика работы:
 * 1. При инициализации - если сегодня понедельник, автоматически устанавливается дата за пятницу предыдущей недели
 * 2. При выборе даты - пользователь может выбрать любую дату, но выходные дни будут отключены
 * 3. При отправке запроса - используется выбранная дата (если она не выходная)
 */
interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  label = "Date",
  disabled = false,
  className = "",
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  // Обновляем внутреннее состояние при изменении внешнего значения
  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    onChange(newDate ? newDate.toISOString().split("T")[0] : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className={`flex flex-col space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>

        <MuiDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          disabled={disabled}
          slotProps={{
            textField: {
              size: "small",
              className: "w-full",
              InputProps: {
                className:
                  "px-3 py-2 border border-blue-800 rounded text-gray-800 w-full",
              },
              placeholder: "Select date",
            },
            day: {
              sx: {
                "&.MuiPickersDay-disabled": {
                  color: "#d1d5db",
                  backgroundColor: "#f3f4f6",
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPickersCalendarHeader-root": {
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                },
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
