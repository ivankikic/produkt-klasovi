import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../../auth/Auth"; // Import AuthService
import { toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import toastify css

const Login = () => {
  const navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Korisničko ime je obavezno"),
    password: Yup.string().required("Lozinka je obavezna"),
  });

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      AuthService.loginUser(values.username, values.password)
        .then(() => {
          navigate("/home");
          toast.success("Uspješna prijava");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.data.message);
        });
    },
  });

  return (
    <div className="container ">
      <h2 className="text-center my-5">Prijava</h2>
      <Form
        noValidate
        onSubmit={formik.handleSubmit}
        className="w-50 m-auto mt-5"
      >
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Korisničko ime:</Form.Label>
          <FormControl
            type="text"
            name="username"
            placeholder="Vaše korisničko ime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            isInvalid={formik.touched.username && !!formik.errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Lozinka:</Form.Label>
          <FormControl
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            isInvalid={formik.touched.password && !!formik.errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/*<p>
          Ako još niste registrirani, idite na{" "}
          <Link to="/register">registraciju</Link>.
        </p>*/}

        <Button variant="primary" type="submit">
          Prijavi se
        </Button>
      </Form>
    </div>
  );
};

export default Login;
