export function formatPatientDoctors(
  doctorNames: string[] | undefined | null,
  emptyLabel: string,
): string {
  if (!doctorNames?.length) {
    return emptyLabel;
  }

  return doctorNames.join('، ');
}
