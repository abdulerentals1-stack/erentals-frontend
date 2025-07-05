'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { FileText } from 'lucide-react';

export default function AddToQuoteButton({ product }) {
  const { user } = useAuth();

  const handleAdd = async () => {
    if (!user) {
      toast.error('Login required to request a quote.');
      return;
    }

    // TODO: Replace with actual quote API
    toast.success('Request sent to quote team (mock)');
  };

  return (
    <Button 
      onClick={handleAdd} 
      variant="ghost" 
      className="rounded-none border-r gap-2"
    >
      <FileText className="w-4 h-4" style={{ color: '#003459' }} />
      Quote
    </Button>
  );
}
