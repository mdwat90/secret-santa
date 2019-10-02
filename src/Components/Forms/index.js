import React from 'react';
import { Formik } from 'formik';

const Basic = () => (
    <div>
    <Formik
      initialValues={{ email: '', password: '', name: '' }}
      validate={values => {
        let errors = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
        <div>
          <h1>Email</h1>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          <div>
            {errors.email && touched.email && errors.email}
          </div>
        </div>
        <div>
          <h1>Name</h1>
          <input
            type="name"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          <div>
            {errors.name && touched.name && errors.name}
          </div>
        </div>
        <div>
          <h1>Password</h1>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          <div>
          {errors.password && touched.password && errors.password}
          </div>
        </div>
          <div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      )}
    </Formik>
  </div>
);


export default Basic;