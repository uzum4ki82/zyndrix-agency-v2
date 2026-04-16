import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { Business } from '@/types';

interface UseBusinessesReturn {
  businessList: Business[];
  leadsList: Business[];
  selectedBusiness: Business | null;
  setBusinessList: Dispatch<SetStateAction<Business[]>>;
  setLeadsList: Dispatch<SetStateAction<Business[]>>;
  setSelectedBusiness: (business: Business | null) => void;
  updateDraft: (content: string) => void;
  updateEmail: (email: string) => void;
  updateBusinessInLists: (business: Business) => void;
  addBusiness: (business: Business) => void;
  addBusinesses: (businesses: Business[]) => void;
}

/**
 * Consolidates three parallel state arrays (businesses, leads, selectedBusiness)
 * into a single source of truth, eliminating sync issues and stale closures.
 */
export function useBusinesses(initialBusinesses: Business[] = [], initialLeads: Business[] = []): UseBusinessesReturn {
  const [businessList, setBusinessList] = useState<Business[]>(initialBusinesses);
  const [leadsList, setLeadsList] = useState<Business[]>(initialLeads);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  /**
   * Updates draft email across all three lists simultaneously, preventing desync.
   * Captures businessId explicitly to avoid stale closure issues.
   */
  const updateDraft = useCallback((content: string) => {
    if (!selectedBusiness) return;

    const businessId = selectedBusiness.id;
    const updatedBusiness = { ...selectedBusiness, draftEmail: content };

    // Update selected business
    setSelectedBusiness(updatedBusiness);

    // Update in leads list
    setLeadsList(prev =>
      prev.map(l => (l.id === businessId ? { ...l, draftEmail: content } : l))
    );

    // Update in businesses list
    setBusinessList(prev =>
      prev.map(b => (b.id === businessId ? { ...b, draftEmail: content } : b))
    );
  }, [selectedBusiness]);

  /**
   * Updates a business in both lists and selected state atomically.
   * Ensures all three sources of truth stay synchronized.
   */
  const updateBusinessInLists = useCallback((updatedBusiness: Business) => {
    const businessId = updatedBusiness.id;

    // Update selected if it matches
    setSelectedBusiness(prev =>
      prev && prev.id === businessId ? updatedBusiness : prev
    );

    // Update in businesses list
    setBusinessList(prev =>
      prev.map(b => (b.id === businessId ? updatedBusiness : b))
    );

    // Update in leads list
    setLeadsList(prev =>
      prev.map(l => (l.id === businessId ? updatedBusiness : l))
    );
  }, []);

  /**
   * Adds a single business to the lists, avoiding duplicates.
   */
  const addBusiness = useCallback((business: Business) => {
    setBusinessList(prev =>
      prev.find(b => b.id === business.id) ? prev : [business, ...prev]
    );

    // Also add to leads if not present
    setLeadsList(prev =>
      prev.find(l => l.id === business.id) ? prev : [business, ...prev]
    );
  }, []);

  /**
   * Adds multiple businesses, preserving uniqueness.
   */
  const addBusinesses = useCallback((businesses: Business[]) => {
    setBusinessList(prev => {
      const existingIds = new Set(prev.map(b => b.id));
      const newBusinesses = businesses.filter(b => !existingIds.has(b.id));
      return newBusinesses.length > 0 ? [...newBusinesses, ...prev] : prev;
    });

    setLeadsList(prev => {
      const existingIds = new Set(prev.map(l => l.id));
      const newLeads = businesses.filter(b => !existingIds.has(b.id));
      return newLeads.length > 0 ? [...newLeads, ...prev] : prev;
    });
  }, []);

  /**
   * Updates email field atomically across all three lists.
   * Prevents stale closure issues by capturing businessId explicitly.
   */
  const updateEmail = useCallback((email: string) => {
    if (!selectedBusiness) return;

    const businessId = selectedBusiness.id;
    const updatedBusiness = { ...selectedBusiness, email };

    setSelectedBusiness(updatedBusiness);

    setLeadsList(prev =>
      prev.map(l => (l.id === businessId ? { ...l, email } : l))
    );

    setBusinessList(prev =>
      prev.map(b => (b.id === businessId ? { ...b, email } : b))
    );
  }, [selectedBusiness]);

  return {
    businessList,
    leadsList,
    selectedBusiness,
    setBusinessList,
    setLeadsList,
    setSelectedBusiness,
    updateDraft,
    updateEmail,
    updateBusinessInLists,
    addBusiness,
    addBusinesses,
  };
}
