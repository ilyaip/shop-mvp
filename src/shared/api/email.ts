/**
 * Email API
 * Functions for sending order emails
 */

import { apiClient } from './client'
import type { SendOrderEmailRequest, SendOrderEmailResponse } from './types'

/**
 * Send order email to customer
 * @param request - Email request data
 * @returns Response with success status
 */
export const sendOrderEmail = async (
  request: SendOrderEmailRequest
): Promise<SendOrderEmailResponse> => {
  const response = await apiClient.post<SendOrderEmailResponse>(
    '/dev-api/send-order-to-email',
    request
  )
  return response.data
}
