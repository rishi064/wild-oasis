import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    throw new Error("Could not load the cabins.");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) throw new Error("Cabin cannot be deleted");

  return data;
}

export async function createCabin(newCabin) {
  const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");

  const imagePath = `${supabaseUrl}/storage/v1/object/sign/cabin-images/${imageName}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYWJpbi1pbWFnZXMvY2FiaW4tMDAyLmpwZyIsImlhdCI6MTc0NDM1MDMwOCwiZXhwIjoxNzQ2OTQyMzA4fQ.vW6TfVhdLK6ELfFSGfg_8uFey4L9hHC2FZl6gjw7C4s`;

  // Create cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) throw new Error("Cabin cannot be created");

  // Upload the file
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image, {
      cacheControl: "3600",
      upsert: false,
    });

  //Delete cabin if error
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log("storage error", storageError);
    throw new Error("Cabin image could not be uploaded. So cabin not created");
  }

  return data;
}
