import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

type FormDataKey = string | number | symbol;
type FormDataRecord = Record<FormDataKey, any>;

interface SubmitFormOptions<T extends FormDataRecord> {
  data: T;
  endpoint: string;
  // router: AppRouterInstance;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  onSuccess?: (response: any) => void; // Callback for successful submission
  onError?: (error: any) => void; // Callback for errors
}

export async function submitForm<T extends FormDataRecord>({
  data,
  endpoint,
  // router,
  setLoading,
  setErrorMessage,
  onSuccess,
  onError,
}: SubmitFormOptions<T>) {
  try {
    setLoading(true);
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key as keyof typeof data]);
    }

    for (const [key, value] of Array.from(formData.entries())) {
      console.log(`${key}, ${value}`);
    }

    // Send a POST request with the form data
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Form submitted successfully:", response.data);

    // Call the onSuccess callback if provided
    if (onSuccess) {
      onSuccess(response.data);
    } else {
      // Default success behavior: redirect to dashboard
      // router.push("/dashboard");
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
  /*try {
     setLoading(true);
     const formData = new FormData();
     for (const key in data) {
       formData.append(key, data[key as keyof typeof data]);
     }
     for (const [key, value] of Array.from(formData.entries())) {
       console.log(`${key}, ${value}`);
     }
     // Send a POST request with the form data
     const response = await axios.post("/api/signup", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });

     console.log("Account created successfully:", response.data);
     router.push("/dashboard");
   } catch (error) {
     if (error instanceof AxiosError) {
       // Handle Axios error
       const message =
         error.response?.data?.message ||
         "An unexpected error occurred during signup.";
       setErrorMessage(message);
       console.error("Error creating account:", message);
     } else {
       // Handle other errors
       setErrorMessage("An unexpected error occurred.");
       console.error("Error creating account:", error);
     }
   } finally {
     setLoading(false);
   }*/
}
