import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import React from 'react';
import colors from '../assets/Colors';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: colors.lightGreen,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export interface Props {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
}

export default function MySnackbarContentWrapper(props: Props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

const useStyles2 = makeStyles((theme: Theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

// export default function CustomizedSnackbars() {
//   const classes = useStyles2();

//   function handleClick() {
//     setOpen(true);
//   }

//   function handleClose(event?: SyntheticEvent, reason?: string) {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   }

//   return (
//     <div>

//       <MySnackbarContentWrapper
//         variant="error"
//         className={classes.margin}
//         message="This is an error message!"
//       />
//       <MySnackbarContentWrapper
//         variant="warning"
//         className={classes.margin}
//         message="This is a warning message!"
//       />
//       <MySnackbarContentWrapper
//         variant="info"
//         className={classes.margin}
//         message="This is an information message!"
//       />
//       <MySnackbarContentWrapper
//         variant="success"
//         className={classes.margin}
//         message="This is a success message!"
//       />
//     </div>
//   );
// }
