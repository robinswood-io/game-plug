'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function TestMutationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log('[TEST]', msg);
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const testMutation = useMutation({
    mutationFn: async (newSanity: number) => {
      addLog(`Mutation called with: ${newSanity}`);
      const response = await apiRequest("PATCH", `/api/characters/d94fc958-9603-4641-94cc-07c8e9903a20`, {
        sanity: newSanity
      });
      addLog('Response received');
      return response.json();
    },
    onSuccess: (data) => {
      addLog(`SUCCESS! Sanity: ${data.sanity}`);
      toast({
        title: "Succès",
        description: `Sanité mise à jour: ${data.sanity}`,
      });
    },
    onError: (error: Error) => {
      addLog(`ERROR: ${error.message}`);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const testToastOnly = () => {
    addLog('Testing toast only...');
    toast({
      title: "Test Toast",
      description: "Si vous voyez ceci, toast fonctionne!",
    });
  };

  const testMutationCall = () => {
    addLog('Calling mutation...');
    testMutation.mutate(40);
  };

  return (
    <div className="min-h-screen bg-deep-black p-8">
      <h1 className="text-2xl font-bold text-aged-gold mb-4">Test Mutation Debug</h1>

      <div className="space-y-4 mb-8">
        <Button onClick={testToastOnly} className="bg-blue-600">
          Test Toast Only
        </Button>

        <Button onClick={testMutationCall} className="bg-green-600">
          Test Mutation (PATCH sanity=40)
        </Button>

        <Button onClick={() => addLog('Simple log test')} className="bg-yellow-600">
          Test Simple Log
        </Button>
      </div>

      <div className="bg-charcoal border border-aged-gold p-4 rounded">
        <h2 className="text-aged-gold mb-2">Logs:</h2>
        <pre className="text-bone-white text-sm whitespace-pre-wrap">
          {log.length === 0 ? 'No logs yet...' : log.join('\n')}
        </pre>
      </div>

      <div className="mt-4 bg-charcoal border border-aged-gold p-4 rounded">
        <h2 className="text-aged-gold mb-2">Mutation State:</h2>
        <pre className="text-bone-white text-xs">
          {JSON.stringify({
            isPending: testMutation.isPending,
            isError: testMutation.isError,
            isSuccess: testMutation.isSuccess,
            error: testMutation.error?.message,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
