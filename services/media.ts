import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "../components/ui";

export interface PickedFile {
  uri: string;
  mimeType: string;
  name: string;
}

function fromImageAsset(asset: ImagePicker.ImagePickerAsset): PickedFile {
  const mimeType = asset.mimeType ?? (asset.uri.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");
  return { uri: asset.uri, mimeType, name: asset.fileName ?? `photo.${mimeType.split("/")[1]}` };
}

export async function pickImage(square = true): Promise<PickedFile | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    showMessage("Photos permission needed", "Allow PawMatch to access your photos to upload a picture.");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: square,
    aspect: square ? [1, 1] : undefined,
    quality: 0.7,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  return fromImageAsset(result.assets[0]);
}

export async function takePhoto(): Promise<PickedFile | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    showMessage("Camera permission needed", "Allow PawMatch to use the camera to photograph your document.");
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
  if (result.canceled || !result.assets?.[0]) return null;
  return fromImageAsset(result.assets[0]);
}

/** JPG, PNG or PDF from the device's files. */
export async function pickDocument(): Promise<PickedFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["image/jpeg", "image/png", "application/pdf"],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  const lower = asset.name.toLowerCase();
  const mimeType =
    asset.mimeType ?? (lower.endsWith(".pdf") ? "application/pdf" : lower.endsWith(".png") ? "image/png" : "image/jpeg");
  return { uri: asset.uri, mimeType, name: asset.name };
}
