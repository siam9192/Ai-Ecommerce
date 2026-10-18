import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

const maxImageSize = 10 * 1024 * 1024;

interface ImgBBResponse {
  success?: boolean;
  data?: {
    url?: string;
  };
  error?: {
    message?: string;
  };
}

function isImgBBResponse(value: unknown): value is ImgBBResponse {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const accessToken = (await cookies()).get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { message: "Sign in with an admin account to upload images." },
      { status: 401 },
    );
  }

  let authResponse: Response;
  try {
    const backendUrl = env.BACKEND_URL.replace(/\/+$/, "");
    authResponse = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Unable to verify admin before ImgBB upload:", error);
    return NextResponse.json(
      { message: "Unable to verify your account. Please try again." },
      { status: 502 },
    );
  }

  if (!authResponse.ok) {
    return NextResponse.json(
      {
        message:
          authResponse.status === 401 || authResponse.status === 403
            ? "An active admin account is required to upload images."
            : "Unable to verify your account. Please try again.",
      },
      {
        status:
          authResponse.status === 401 || authResponse.status === 403
            ? authResponse.status
            : 502,
      },
    );
  }

  let authData: unknown;
  try {
    authData = await authResponse.json();
  } catch (error) {
    console.error("Admin verification returned invalid JSON:", error);
    return NextResponse.json(
      { message: "Unable to verify your account. Please try again." },
      { status: 502 },
    );
  }

  if (
    !isImgBBResponse(authData) ||
    typeof authData.data !== "object" ||
    authData.data === null ||
    !("role" in authData.data) ||
    authData.data.role !== "admin"
  ) {
    return NextResponse.json(
      { message: "An admin account is required to upload images." },
      { status: 403 },
    );
  }

  if (!env.IMGBB_API_KEY) {
    console.error("ImgBB upload requested but IMGBB_API_KEY is not configured.");
    return NextResponse.json(
      { message: "Image uploads are not configured. Contact the administrator." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "Select an image file to upload." },
      { status: 400 },
    );
  }

  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json(
      { message: "Select an image file to upload." },
      { status: 400 },
    );
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image files can be uploaded." },
      { status: 400 },
    );
  }
  if (image.size === 0 || image.size > maxImageSize) {
    return NextResponse.json(
      { message: "Choose an image smaller than 10 MB." },
      { status: 413 },
    );
  }

  const imgbbForm = new FormData();
  imgbbForm.append("key", env.IMGBB_API_KEY);
  imgbbForm.append("image", image, image.name);

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbForm,
    });
  } catch (error) {
    console.error("ImgBB upload request failed:", error);
    return NextResponse.json(
      { message: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }

  let uploadData: unknown;
  try {
    uploadData = await uploadResponse.json();
  } catch (error) {
    console.error("ImgBB returned invalid upload JSON:", error);
    return NextResponse.json(
      { message: "The image host returned an invalid response." },
      { status: 502 },
    );
  }

  if (
    !uploadResponse.ok ||
    !isImgBBResponse(uploadData) ||
    uploadData.success !== true ||
    typeof uploadData.data?.url !== "string"
  ) {
    const message =
      isImgBBResponse(uploadData) && typeof uploadData.error?.message === "string"
        ? uploadData.error.message
        : "The image host could not save this image.";
    console.error("ImgBB rejected an image upload:", message);
    return NextResponse.json({ message }, { status: 502 });
  }

  return NextResponse.json({ url: uploadData.data.url });
}
