import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

type FormDataKey = string | number | symbol;
type FormDataRecord = Record<FormDataKey, any>;

interface SubmitFormOptions<T extends FormDataRecord> {
  data: T;
  endpoint: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  onSuccess?: (response: any) => void; // Callback for successful submission
  onError?: (error: any) => void; // Callback for errors
}

export async function submitForm<T extends FormDataRecord>({
  data,
  endpoint,
  setLoading,
  setErrorMessage,
  onSuccess,
  onError,
}: SubmitFormOptions<T>) {
  try {
    setLoading(true);
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    // const formData = new FormData();
    // for (const key in data) {
    //   formData.append(key, data[key as keyof typeof data]);
    // }
    //
    // for (const [key, value] of Array.from(formData.entries())) {
    //   console.log(`${key}, ${value}`);
    // }
    console.log(data);

    // Send a POST request with the form data
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Form submitted successfully:", response.data);

    // Call the onSuccess callback if provided
    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle Axios error
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      setErrorMessage(message);
      console.error("Error:", message);
    } else {
      // Handle other errors
      setErrorMessage("An unexpected error occurred.");
      console.error("Error:", error);
    }

    // Call the onError callback if provided
    if (onError) {
      onError(error);
    }
  } finally {
    setLoading(false);
  }
}
