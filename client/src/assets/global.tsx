import { Global, css } from "@emotion/react";
import { cssReset } from "./cssReset";
import { theme } from "./theme";

export const GlobalStyle = () => {
  return (
    <Global
      styles={css`
      ${cssReset};

      body {
        color: ${theme.colors.primaryColor};
        background-color: ${theme.colors.backgroundColor};
      }

      html,
      #root {
        scroll-behavior: smooth;
        height: 100%;
      }

      /* Globally reset ugly link style */
      a {
        color: inherit;
        text-decoration: inherit;
      }
      @media print {
        .print-header,
        .print-sidebar {
          display: none !important;
        }
        .icons-container {
          display: none !important;
        }
      }

      .material-symbols-outlined {
        font-size: 30px;
      }

      .material-symbols-rounded {
        color: red;
        font-size: 36px;
        cursor: pointer;
      }
      @media print {
        div[ref='componentToPrintRef'] {
        }

        #regulationPage {
          margin-left: 0 !important;
          padding-left: 0 !important;
          background-color: white !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #publicationPage {
          margin: 50px !important;
          background-color: white !important;
        }
      }
      @media print {
        .print-header,
        .print-sidebar {
          display: none !important;
        }
        .icons-container {
          display: none !important;
        }
      }
      .active-date {
        background-color: #f5dcc0;
      }
      .react-toggle-track {
        div {
          top: 8px;
        }
        div:last-child {
          right: 13px;
        }
        div:first-of-type {
          top: 7px;
          left: 4px;
      }
      @media (max-width: 1500px) {
        .material-symbols-outlined {
          font-size: 18px;
        }
      }
    `}
    />
  );
};
