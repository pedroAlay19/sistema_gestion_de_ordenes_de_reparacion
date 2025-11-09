# Configuración de Supabase Storage para Imágenes

## 📋 Pasos para Configurar Supabase

### 1. Crear/Acceder a tu Proyecto de Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto o selecciona uno existente

### 2. Obtener las Credenciales

1. En tu proyecto, ve a **Settings** (⚙️) en la barra lateral
2. Selecciona **API**
3. Copia los siguientes valores:
   - **Project URL**: Tu `SUPABASE_URL`
   - **anon public**: Tu `SUPABASE_ANON_KEY`

### 3. Configurar Variables de Entorno

Edita el archivo `.env` en la carpeta `frontend`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Crear el Bucket de Storage

1. En tu proyecto de Supabase, ve a **Storage** en la barra lateral
2. Haz clic en **Create a new bucket** o **New bucket**
3. Configura el bucket:
   - **Name**: `repair-order-images` (exactamente este nombre)
   - **Public bucket**: ✅ **IMPORTANTE: MARCA ESTE CHECKBOX** 
   - **File size limit**: `5242880` (5MB en bytes) - opcional
   - **Allowed MIME types**: Déjalo vacío o pon `image/*` - opcional

4. Haz clic en **Create bucket** o **Save**

⚠️ **MUY IMPORTANTE**: Si el bucket no es público, tendrás errores de "row-level security policy"

### 5. Configurar Políticas de Storage (RLS - Row Level Security)

**OPCIÓN FÁCIL: Usar el script SQL automatizado**

1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Haz clic en **New query**
3. Abre el archivo `supabase-storage-setup.sql` del proyecto
4. Copia TODO el contenido y pégalo en el SQL Editor
5. Haz clic en **Run** (▶️)
6. Verifica que no haya errores

**OPCIÓN MANUAL: Crear políticas una por una**

Si prefieres hacerlo manualmente:

1. Ve a **Storage** → `repair-order-images` → **Policies**
2. Crea cada política con el botón **New Policy**

#### Política 1: Upload (Subir imágenes)
```sql
CREATE POLICY "Public upload to repair-order-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'repair-order-images');
```

#### Política 2: Read (Leer/Ver imágenes)
```sql
CREATE POLICY "Public read repair-order-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'repair-order-images');
```

#### Política 3: Delete (Eliminar imágenes)
```sql
CREATE POLICY "Public delete repair-order-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'repair-order-images');
```

#### Política 4: Update (Actualizar imágenes)
```sql
CREATE POLICY "Public update repair-order-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'repair-order-images');
```

⚠️ **NOTA**: Estas políticas son **públicas** (permiten acceso sin autenticación) para facilitar el desarrollo. Para producción, considera usar políticas más restrictivas que requieran autenticación.

### 6. Reiniciar el Servidor de Desarrollo

Después de configurar las variables de entorno:

```bash
# Detén el servidor (Ctrl+C)
# Inicia nuevamente
npm run dev
```

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. Ve al formulario de nueva orden de reparación
2. Intenta subir una imagen
3. Revisa la consola del navegador para ver los logs de upload
4. Verifica en Supabase Storage que la imagen se subió correctamente

## 🔍 Debugging

Si tienes problemas:

### Error: "Supabase credentials not found"
- Verifica que el archivo `.env` existe en la carpeta `frontend`
- Verifica que las variables comienzan con `VITE_`
- Reinicia el servidor de desarrollo

### Error: "new row violates row-level security policy"
- Verifica que creaste las políticas de Storage
- Verifica que el bucket es público
- Verifica que el usuario está autenticado

### Error: "Failed to upload"
- Verifica que el bucket existe y se llama `repair-order-images`
- Verifica que el bucket es público
- Verifica los límites de tamaño del archivo

## 📚 Recursos Adicionales

- [Documentación de Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies Examples](https://supabase.com/docs/guides/storage/security/access-control)

## 🎯 Características Implementadas

- ✅ Upload de múltiples imágenes
- ✅ Validación de tipo de archivo (JPG, PNG, WEBP, GIF)
- ✅ Validación de tamaño (máx. 5MB por imagen)
- ✅ Preview de imágenes antes de subir
- ✅ Eliminación de imágenes de la lista
- ✅ Nombres únicos generados automáticamente
- ✅ URLs públicas retornadas automáticamente
- ✅ Indicador de progreso durante la subida
- ✅ Logs detallados en consola para debugging
