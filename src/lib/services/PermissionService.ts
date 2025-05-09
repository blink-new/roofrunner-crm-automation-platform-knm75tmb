import { supabase } from '../supabase';

export class PermissionService {
  static async getWorkflowPermissions(workflowId: string) {
    const { data, error } = await supabase
      .from('workflow_permissions')
      .select('*')
      .eq('workflow_id', workflowId);

    if (error) throw error;
    return data;
  }

  static async updateWorkflowPermissions(
    workflowId: string,
    permissions: {
      view: string[];
      edit: string[];
    }
  ) {
    // First delete existing permissions
    await supabase
      .from('workflow_permissions')
      .delete()
      .eq('workflow_id', workflowId);

    // Then insert new view permissions
    if (permissions.view.length > 0) {
      const viewPermissions = permissions.view.map(userId => ({
        workflow_id: workflowId,
        user_id: userId,
        permission: 'view'
      }));

      const { error: viewError } = await supabase
        .from('workflow_permissions')
        .insert(viewPermissions);

      if (viewError) throw viewError;
    }

    // Then insert new edit permissions
    if (permissions.edit.length > 0) {
      const editPermissions = permissions.edit.map(userId => ({
        workflow_id: workflowId,
        user_id: userId,
        permission: 'edit'
      }));

      const { error: editError } = await supabase
        .from('workflow_permissions')
        .insert(editPermissions);

      if (editError) throw editError;
    }
  }

  static async getFolderPermissions(folderId: string) {
    const { data, error } = await supabase
      .from('workflow_folder_permissions')
      .select('*')
      .eq('folder_id', folderId);

    if (error) throw error;
    return data;
  }

  static async updateFolderPermissions(
    folderId: string,
    permissions: {
      view: string[];
      edit: string[];
    }
  ) {
    // First delete existing permissions
    await supabase
      .from('workflow_folder_permissions')
      .delete()
      .eq('folder_id', folderId);

    // Then insert new view permissions
    if (permissions.view.length > 0) {
      const viewPermissions = permissions.view.map(userId => ({
        folder_id: folderId,
        user_id: userId,
        permission: 'view'
      }));

      const { error: viewError } = await supabase
        .from('workflow_folder_permissions')
        .insert(viewPermissions);

      if (viewError) throw viewError;
    }

    // Then insert new edit permissions
    if (permissions.edit.length > 0) {
      const editPermissions = permissions.edit.map(userId => ({
        folder_id: folderId,
        user_id: userId,
        permission: 'edit'
      }));

      const { error: editError } = await supabase
        .from('workflow_folder_permissions')
        .insert(editPermissions);

      if (editError) throw editError;
    }
  }

  static async getReportPermissions(reportId: string) {
    const { data, error } = await supabase
      .functions
      .invoke('get-report-permissions', {
        body: { report_id: reportId }
      });

    if (error) throw error;
    return data;
  }

  static async updateReportPermissions(
    reportId: string,
    permissions: {
      view: string[];
      edit: string[];
    }
  ) {
    const { data, error } = await supabase
      .functions
      .invoke('update-report-permissions', {
        body: { report_id: reportId, permissions }
      });

    if (error) throw error;
    return data;
  }

  static async createShareLink(
    reportId: string,
    expiresAt?: string
  ): Promise<{ url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('create-report-share-link', {
        body: { report_id: reportId, expires_at: expiresAt }
      });

    if (error) throw error;
    return data;
  }
}