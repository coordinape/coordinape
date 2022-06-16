import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY;
const tableId = process.env.AIRTABLE_CRM_TABLE_ID;
const baseId = process.env.AIRTABLE_CRM_BASE_ID;

type CRMInput = {
  MemberName: string;
  OrgName: string;
  ContactInfo: string;
  ContactMethod: string;
  CircleName: string;
  RequestedWhiteGlove: boolean;
  MemberProvidedNotes: string;
};

export class AirtableNotConfiguredError extends Error {
  constructor() {
    super('No Airtable API Key and/or table and/or base provided');
  }
}

export const insertCRMRecord = async (input: CRMInput) => {
  if (!tableId || !apiKey || !baseId) {
    throw new AirtableNotConfiguredError();
  }

  const base = new Airtable({ apiKey }).base(baseId);
  await base(tableId).create([
    {
      fields: {
        ...input,
      },
    },
  ]);
};
