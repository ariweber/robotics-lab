import { supabase } from "../DB/supabase.js";

async function getSessionById(id) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, topic, dateTime, capacity")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function searchSessions({ topic, capacity } = {}) {
  let query = supabase.from("sessions").select("id, topic, dateTime, capacity");
  if (topic) query = query.ilike("topic", `%${topic}%`);
  if (capacity) query = query.gte("capacity", capacity);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function countRegistrations(sessionId) {
  const { data, error } = await supabase
    .from("registrations")
    .select()
    .eq("session_id", sessionId);
  if (error) throw error;
  return data.length;
}

async function isRegistered(sessionId, studentId) {
  const { data, error } = await supabase
    .from("registrations")
    .select("session_id")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

async function addRegistration(sessionId, studentId) {
  const { error } = await supabase
    .from("registrations")
    .insert({ session_id: sessionId, student_id: studentId });
  if (error) throw error;
}

async function removeRegistration(sessionId, studentId) {
  const { error } = await supabase
    .from("registrations")
    .delete()
    .eq("session_id", sessionId)
    .eq("student_id", studentId);
  if (error) throw error;
}

export const sessionRepo = {
  getById: getSessionById,
  search: searchSessions,
  countRegistrations,
  isRegistered,
  addRegistration,
  removeRegistration,
};
