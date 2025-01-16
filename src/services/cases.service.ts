import { supabase } from '../config/supabase';
import type { Case } from '../types';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_IMAGE_DIMENSION = 800; // pixels

function mapCaseFromDB(data: any): Case {
  return {
    id: data.id,
    patientId: data.patient_id,
    summary: data.summary,
    clinicalFindings: data.clinical_findings,
    images: data.images || [],
    tags: data.tags || [],
    externalLinks: data.external_links || [],
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export const casesService = {
  async getCases(): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
      throw new Error('Failed to fetch cases');
    }

    return data.map(mapCaseFromDB);
  },

  async getCase(id: string): Promise<Case> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching case:', error);
      throw new Error('Failed to fetch case');
    }

    return mapCaseFromDB(data);
  },

  async addCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('cases')
      .insert([{
        patient_id: caseData.patientId,
        summary: caseData.summary,
        clinical_findings: caseData.clinicalFindings,
        images: caseData.images,
        tags: caseData.tags,
        external_links: caseData.externalLinks,
        created_by: caseData.createdBy
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating case:', error);
      throw new Error('Failed to create case');
    }

    return mapCaseFromDB(data);
  },

  async getTotalCases(): Promise<number> {
    const { count, error } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting cases:', error);
      throw new Error('Failed to count cases');
    }

    return count || 0;
  },

  async getRecentCases(limit: number = 5): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent cases:', error);
      throw new Error('Failed to fetch recent cases');
    }

    return data.map(mapCaseFromDB);
  },

  async searchCases(query: string): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .or(`summary.ilike.%${query}%,clinical_findings.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching cases:', error);
      throw new Error('Failed to search cases');
    }

    return data.map(mapCaseFromDB);
  }
};