/**
 * Supabase Client Configuration
 * 
 * Cliente configurado para interactuar con Supabase Storage
 * para la carga de imágenes de órdenes de reparación.
 */

import { createClient } from '@supabase/supabase-js';

// TODO: Agregar estas variables en un archivo .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload an image to Supabase Storage
 * @param file - Image file to upload
 * @param bucket - Storage bucket name (default: 'repair-order-images')
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'repair-order-images'
): Promise<string> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF)');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('La imagen es muy grande. Tamaño máximo: 5MB');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('📤 Uploading image to Supabase Storage:', {
      bucket,
      fileName,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type,
    });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Error uploading to Supabase:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        cause: error.cause,
      });
      
      // Mensaje más específico según el error
      if (error.message.includes('row-level security policy')) {
        throw new Error(
          'Error de permisos en Supabase Storage. ' +
          'Verifica que el bucket "repair-order-images" exista, sea público, ' +
          'y tenga las políticas de seguridad configuradas correctamente. ' +
          'Ver archivo: supabase-storage-setup.sql'
        );
      }
      
      throw new Error(`Error al subir la imagen: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log('✅ Image uploaded successfully:', urlData.publicUrl);

    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Error in uploadImage:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url - Public URL of the image
 * @param bucket - Storage bucket name
 */
export async function deleteImage(
  url: string,
  bucket: string = 'repair-order-images'
): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const filePath = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting from Supabase:', error);
      throw new Error(`Error al eliminar la imagen: ${error.message}`);
    }

    console.log('🗑️ Image deleted successfully');
  } catch (error) {
    console.error('❌ Error in deleteImage:', error);
    throw error;
  }
}
