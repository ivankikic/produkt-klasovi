import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../auth/Auth"; // Import AuthService instead of axiosClient
import { toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import toastify css

const Register = () => {
  const navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Neispravan email format")
      .required("Email je obavezan"),
    username: Yup.string()
      .min(6, "Korisničko ime mora imati najmanje 6 znakova")
      .required("Korisničko ime je obavezno"),
    password: Yup.string()
      .min(6, "Lozinke mora imati najmanje 6 znakova")
      .required("Lozinke je obavezna"),
  });

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      AuthService.registerUser(values.username, values.email, values.password)
        .then(() => {
          navigate("/home");
          toast.success("Registration successful"); // Adjust the message as per your API response
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    },
  });

  return (
    <div className="container ">
      <h2 className="text-center my-5">Registracija</h2>
      <Form
        noValidate
        onSubmit={formik.handleSubmit}
        className="w-50 m-auto mt-5"
      >
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <FormControl
            type="email"
            name="email"
            placeholder="Vaša email adresa"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

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

        <p>
          Ako već imate račun, idite na <Link to="/login">prijavu</Link>.
        </p>

        <Button variant="primary" type="submit">
          Registriraj se
        </Button>
      </Form>
    </div>
  );
};

export default Register;
