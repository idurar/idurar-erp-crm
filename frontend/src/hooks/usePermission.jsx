import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { accessTypes, adminRoles } from '@/utils/constants';
import { useSelector } from 'react-redux';

const usePermission = () => {
  const currentlyLoggedInUser = useSelector(selectCurrentAdmin);

  const isPermissionTypeValid = (permissionType) => {
    // Validate if permissionType is valid. If not, return false
    for (let key in accessTypes) if (accessTypes[key] === permissionType) return true;
    return false;
  };

  const hasPermission = (permissionType) => {
    if (!isPermissionTypeValid(permissionType)) return false;
    if (!currentlyLoggedInUser) return false;

    switch (permissionType) {
      case accessTypes.EDIT:
        return (
          currentlyLoggedInUser.role !== adminRoles.READ_ONLY &&
          currentlyLoggedInUser.role !== adminRoles.CREATE_ONLY
        );
      case accessTypes.CREATE:
        return currentlyLoggedInUser.role !== adminRoles.READ_ONLY;
      case accessTypes.DELETE:
        return (
          currentlyLoggedInUser.role === adminRoles.STAFF_ADMIN ||
          currentlyLoggedInUser.role === adminRoles.SUPER_ADMIN
        );
      default:
        return false;
    }
  };

  return { hasPermission };
};

export default usePermission;
