"use client";

interface CityEditToolbarProps {
  isEditMode: boolean;
  isSaving: boolean;
  hasPendingChanges: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CityEditToolbar({
  isEditMode,
  isSaving,
  hasPendingChanges,
  onEdit,
  onSave,
  onCancel,
}: CityEditToolbarProps) {
  if (!isEditMode) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="premium-button premium-button--primary"
      >
        Edit City
      </button>
    );
  }

  return (
    <div className="premium-toolbar">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="premium-button premium-button--success"
      >
        {isSaving ? "Saving..." : hasPendingChanges ? "Save" : "Done"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="premium-button premium-button--secondary"
      >
        Exit
      </button>
    </div>
  );
}
