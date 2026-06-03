import type {Mailer} from './types'
import {resendMailer} from './resend'

export type {Mailer, EmailMessage} from './types'

export const mailer: Mailer = resendMailer
