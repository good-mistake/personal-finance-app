import React, { useEffect } from "react";
import data from "../../../data.json";
import Sidebar from "../../reusable/sidebar/Sidebar.tsx";
import "./pots.scss";
import SkeletonPot from "../../reusable/skeleton/skeletonPot/Skeleton.tsx";
import Buttons from "../../reusable/button/Buttons.tsx";
import ProgressBar from "./progressbar/ProgressBar.tsx";
import { formatCurrency } from "../../../utils/utils.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import {
  setSelectedPot,
  openModal,
  closeModal,
} from "../../redux/potsSlice.ts";
import { setPots, setLoading } from "../../redux/potsSlice.ts";
import DropDownPot from "./dropdownPot/DropDownPot.tsx";
import PotsModalManager from "./potsModalManager/PotsModalManager.tsx";
import { fetchPots } from "../../services/pots.js";
import { setAuthLoading } from "../../redux/userSlice.ts";
import useMediaQuery from "../../../utils/useMediaQuery.tsx";
import { v4 as uuidv4 } from "uuid";

const Pots = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("mobile");
  const isTablet = useMediaQuery("tablet");
  const sidebarVariant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const { pots, loading } = useSelector((state: RootState) => state.pots);
  const { isAuthenticated, authLoading } = useSelector(
    (state: RootState) => state.user
  );

  const handleOpenModal = (modalType: string) => {
    dispatch(openModal(modalType));
  };

  useEffect(() => {
    const token = isAuthenticated ? localStorage.getItem("token") : null;
    dispatch(setLoading(true));

    if (isAuthenticated && token) {
      fetchPots(token)
        .then((potsData) => {
          dispatch(setPots({ pots: potsData, isAuthenticated: true }));
        })
        .catch((err) => console.error("Error fetching pots:", err))
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setAuthLoading(false));
      dispatch(setPots({ pots: data.pots, isAuthenticated: false }));
      dispatch(setLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(closeModal());
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dispatch]);

  const safePots = pots || [];

  const handlePotAction = (potId: string, action: string) => {
    if (potId) {
      dispatch(setSelectedPot(potId));
      handleOpenModal(action);
    } else {
      console.error("Pot is not selected or ID is missing.");
    }
  };

  return (
    <div className="potsContainer">
      <Sidebar variant={sidebarVariant} position="left">
        <section className="potsHeader">
          <h1>Pots</h1>
          <Buttons
            variant="primary"
            size="large"
            children="+ Add New Pot"
            disabled={false}
            onClick={() => {
              handleOpenModal("addPot");
            }}
          />
        </section>
        <section className="pots">
          {authLoading || loading
            ? [...Array(4)].map((_, idx) => <SkeletonPot key={idx} />)
            : safePots.map((e) => {
                const total = e.total || 0;
                const target = e.target || 0;
                const potId = e.id || e._id || uuidv4();

                return (
                  <div className="potsInfo" key={potId}>
                    <div className="potsInfoHeader">
                      <h5>
                        <span
                          style={{ backgroundColor: e.theme }}
                          className="circle"
                        ></span>
                        {e.name}
                      </h5>
                      <DropDownPot potId={potId} />
                    </div>
                    <div className="potsInfoContent">
                      <div className="totalSaved">
                        <span>Total Saved</span>
                        <p> {formatCurrency(total > 0 ? total : 0)}</p>
                      </div>
                      <ProgressBar
                        total={total}
                        target={target}
                        theme={e.theme}
                      />
                    </div>
                    <div className="potsInfoFooter">
                      <Buttons
                        variant="secondary"
                        size="large"
                        disabled={!potId}
                        children="+ Add Money"
                        onClick={() => handlePotAction(potId, "addMoney")}
                      />
                      <Buttons
                        variant="secondary"
                        size="large"
                        disabled={!potId}
                        children="Withdraw"
                        onClick={() => handlePotAction(potId, "withDraw")}
                      />
                    </div>
                  </div>
                );
              })}
        </section>
      </Sidebar>
      <PotsModalManager />
    </div>
  );
};

export default Pots;
