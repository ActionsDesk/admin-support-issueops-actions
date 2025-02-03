import type { Role } from './enums.js';
/** Action Inputs */
export type Inputs = {
    /** Required Inputs */
    /** Action to Perform */
    action: string;
    /** Allowed Organizations */
    allowedOrgs: string[];
    /** Admin Token */
    adminToken: string;
    /** Optional Inputs */
    /** Demotion Date */
    demotionDate: Date | undefined;
    /** Issue Number */
    issueNumber: number | undefined;
    /** Parsed Issue */
    parsedIssue: {
        /** Description */
        description: string | undefined;
        /** Duration */
        duration: number;
        /** Ticket */
        ticket: string | undefined;
        /** Target Organization */
        organization: string;
    } | undefined;
    /** Promotion Date */
    promotionDate: Date | undefined;
    /** Report Path */
    reportPath: string | undefined;
    /** Role */
    role: Role | undefined;
    /** Username */
    username: string | undefined;
};
/** Audit Log API Response Item */
export type AuditLogEntry = {
    _document_id: string;
    action: string;
    actor: string;
    event: string;
    name: string;
    org: string;
    repo: string;
    user: string;
};
/** Command Result */
export type Result = {
    /** Result Status */
    status: 'success' | 'error' | undefined;
    /** Output */
    output: string;
};
