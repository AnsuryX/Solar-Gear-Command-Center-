import axios from 'axios';

export interface N8nTool {
  name: string;
  description: string;
  inputSchema: any;
}

export const callN8nTool = async (method: string, params: any = {}) => {
  const url = localStorage.getItem('n8n_url');
  const token = localStorage.getItem('n8n_key');
  
  if (!url || !token) {
    throw new Error('n8n Configuration Missing');
  }

  const response = await axios.post('/api/n8n/proxy', {
    url,
    token,
    method: 'POST',
    data: {
      method,
      params
    }
  });

  return response.data;
};

export const listN8nTools = async () => {
    return callN8nTool('list_tools');
};

export const executeN8nWorkflow = async (workflowName: string, data: any) => {
    return callN8nTool('call_tool', {
        name: 'execute_workflow',
        arguments: {
            workflow: workflowName,
            data
        }
    });
};

export const createN8nAgent = async (agentConfig: any) => {
    return callN8nTool('call_tool', {
        name: 'create_agent',
        arguments: agentConfig
    });
};
