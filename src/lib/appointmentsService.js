import { supabase } from './supabase'

function rowToApt(row) {
  return {
    id:             row.id,
    userId:         row.user_id,
    userName:       row.user_name  || 'Anonim',
    userEmail:      row.user_email || '',
    psychologistId: row.psychologist_id,
    date:           row.date,
    startTime:      row.start_time,
    endTime:        row.end_time,
    status:         row.status,
    notes:          row.notes      || '',
    createdAt:      row.created_at,
    cancelledAt:    row.cancelled_at || null,
    cancelledBy:    row.cancelled_by || null,
  }
}

/** @param {string} userId  @returns {Promise<object[]>} */
export async function fetchUserAppointments(userId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date',       { ascending: true })
    .order('start_time', { ascending: true })
  if (error) { if (import.meta.env.DEV) console.warn('[appointments] fetchUser:', error.message); return [] }
  return (data || []).map(rowToApt)
}

/** @returns {Promise<object[]>} */
export async function fetchAllAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date',       { ascending: true })
    .order('start_time', { ascending: true })
  if (error) { if (import.meta.env.DEV) console.warn('[appointments] fetchAll:', error.message); return [] }
  return (data || []).map(rowToApt)
}

/**
 * Uses get_month_bookings RPC (security definer) so any authenticated user
 * can see which slots are taken — required for calendar availability display.
 * @param {string} psychologistId
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {Promise<{ date: string, startTime: string, endTime: string }[]>}
 */
export async function fetchMonthBookings(psychologistId, year, month) {
  const m     = String(month + 1).padStart(2, '0')
  const lastD = String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')
  const { data, error } = await supabase.rpc('get_month_bookings', {
    p_psychologist_id: psychologistId,
    p_from: `${year}-${m}-01`,
    p_to:   `${year}-${m}-${lastD}`,
  })
  if (error) { if (import.meta.env.DEV) console.warn('[appointments] fetchMonth:', error.message); return [] }
  return (data || []).map(r => ({ date: r.date, startTime: r.start_time, endTime: r.end_time }))
}

/**
 * Uses get_booked_slots RPC (security definer) so any authenticated user
 * can see which slots are taken on a given day without exposing other users'
 * booking details.
 * @param {string} psychologistId
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {Promise<{ startTime: string, endTime: string }[]>}
 */
export async function fetchDayBookings(psychologistId, dateStr) {
  const { data, error } = await supabase.rpc('get_booked_slots', {
    p_psychologist_id: psychologistId,
    p_date: dateStr,
  })
  if (error) { if (import.meta.env.DEV) console.warn('[appointments] fetchDay:', error.message); return [] }
  return (data || []).map(r => ({ startTime: r.start_time, endTime: r.end_time }))
}

/**
 * @param {{ userId: string, userName: string, userEmail: string, psychologistId: string, date: string, startTime: string, endTime: string, notes?: string }} _
 * @returns {Promise<{ success: true, appointment: object } | { success: false, error: string, message: string }>}
 */
export async function createAppointment({
  userId, userName, userEmail,
  psychologistId, date, startTime, endTime, notes = '',
}) {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      user_id:         userId,
      user_name:       userName  || 'Anonim',
      user_email:      userEmail || '',
      psychologist_id: psychologistId,
      date,
      start_time:      startTime,
      end_time:        endTime,
      status:          'booked',
      notes,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'conflict', message: 'Ky orar sapo u rezervua nga dikush tjetër.' }
    }
    console.error('[appointments] create:', error.message)
    return { success: false, error: 'server_error', message: 'Gabim gjatë rezervimit. Provo përsëri.' }
  }
  return { success: true, appointment: rowToApt(data) }
}

/**
 * @param {string|number} id
 * @param {'user'|'admin'|'psychologist'} [cancelledBy]
 * @returns {Promise<{ success: boolean }>}
 */
export async function cancelAppointment(id, cancelledBy = 'user') {
  const { error } = await supabase
    .from('appointments')
    .update({
      status:       'cancelled',
      cancelled_at: new Date().toISOString(),
      cancelled_by: cancelledBy,
    })
    .eq('id', id)
  if (error) { console.error('[appointments] cancel:', error.message); return { success: false } }
  return { success: true }
}
