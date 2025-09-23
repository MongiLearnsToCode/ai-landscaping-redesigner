import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import type { HistoryItem, DesignCatalog, LandscapingStyle } from '../../types';
import { useToast } from './ToastContext';
import { useApp } from './AppContext';

interface NewRedesignData {
    original_image_url: string;
    redesigned_image_url: string;
    design_catalog: DesignCatalog;
    style: LandscapingStyle;
    climate_zone: string;
}

interface HistoryContextType {
  history: HistoryItem[];
  saveNewRedesign: (data: NewRedesignData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  pinItem: (id: string) => Promise<void>;
  viewFromHistory: (item: HistoryItem) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const supabase = useSupabaseClient();
  const user = useUser();
  const { addToast } = useToast();
  const { loadItem } = useApp();

  const refreshHistory = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      addToast('Could not load your design history.', 'error');
    }
  }, [supabase, user, addToast]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const saveNewRedesign = useCallback(async (data: NewRedesignData) => {
    if (!user) {
        addToast('You must be logged in to save a design.', 'error');
        return;
    }
    try {
        const { data: newRecord, error } = await supabase
            .from('designs')
            .insert({
                ...data,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        
        setHistory(prev => [newRecord, ...prev]);
        addToast("Redesign saved to history!", "success");
    } catch (err) {
        console.error("Failed to save history item", err);
        addToast("Error saving redesign to history.", "error");
    }
  }, [supabase, user, addToast]);

  const deleteItem = useCallback(async (id: string) => {
    try {
        const { error } = await supabase.from('designs').delete().match({ id });
        if (error) throw error;
        setHistory(prev => prev.filter(item => item.id !== id));
        addToast("Item deleted from history.", "info");
    } catch (error) {
        console.error('Error deleting item:', error);
        addToast("Failed to delete item.", "error");
    }
  }, [supabase, addToast]);

  const pinItem = useCallback(async (id: string) => {
    const itemToToggle = history.find(item => item.id === id);
    if (!itemToToggle) return;

    try {
        const { data, error } = await supabase
            .from('designs')
            .update({ is_pinned: !itemToToggle.is_pinned })
            .match({ id })
            .select()
            .single();

        if (error) throw error;

        setHistory(prev => prev.map(item => item.id === id ? data : item));
        addToast(data.is_pinned ? "Item pinned!" : "Item unpinned.", "success");
    } catch (error) {
        console.error('Error pinning item:', error);
        addToast("Failed to update pin status.", "error");
    }
  }, [supabase, history, addToast]);

  const viewFromHistory = useCallback((item: HistoryItem) => {
    // The item from Supabase already has the URLs, so we can load it directly.
    // The `HydratedHistoryItem` in types.ts is now structurally the same as HistoryItem
    // but we keep it for semantic clarity in the components.
    loadItem(item as any);
  }, [loadItem]);

  const value = {
    history,
    saveNewRedesign,
    deleteItem,
    pinItem,
    viewFromHistory,
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};