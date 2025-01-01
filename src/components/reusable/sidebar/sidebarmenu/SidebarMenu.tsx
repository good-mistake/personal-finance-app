import React, { useState } from "react";
import "./sidebarmenu.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/userSlice";
import { persistor } from "../../../redux/store";

interface SidebarMenuProps {
  size: "desktop" | "tablet" | "mobile";
  position?: "left" | "right";
  onToggle?: (isOpen: boolean) => void;
}
const SidebarMenu: React.FC<SidebarMenuProps> = ({
  size = "desktop",
  position = "left",
  onToggle,
}) => {
  const [variant, setVariant] = useState<"desktopClose" | "desktopOpen">(
    "desktopClose"
  );
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleSidebar = () => {
    const newVariant =
      variant === "desktopClose" ? "desktopOpen" : "desktopClose";

    setVariant((prev) =>
      prev === "desktopClose" ? "desktopOpen" : "desktopClose"
    );
    onToggle?.(newVariant === "desktopOpen");
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    persistor.purge();
    navigate("/login");
  };
  const positionClass = position === "right" ? "nav--right" : "nav--left";

  return (
    <nav
      className={`nav--${size} ${
        size === "desktop" ? `nav--${variant}` : ""
      }  ${positionClass}`}
    >
      <div className="logo">
        {variant === "desktopClose" ? (
          <img src="/images/logo-small.svg" alt="logo" />
        ) : (
          <img src="/images/logo-large.svg" alt="logo" />
        )}
        <div className="userName">
          {user ? (
            <span>
              {variant === "desktopOpen" || size === "tablet"
                ? `Welcome, ${user.name}`
                : ""}
            </span>
          ) : (
            <span>
              {" "}
              {variant === "desktopOpen" || size === "tablet"
                ? `Welcome, Guest`
                : ""}
            </span>
          )}
        </div>{" "}
      </div>
      <div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <svg
                className="svgIcon"
                fill="none"
                height="19"
                viewBox="0 0 18 19"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8.59282v8.66718c0 .3978-.158.7794-.4393 1.0607s-.6629.4393-1.0607.4393h-3.75c-.3978 0-.7794-.158-1.0607-.4393s-.4393-.6629-.4393-1.0607v-3.75c0-.1989-.079-.3897-.2197-.5303-.1406-.1407-.3314-.2197-.5303-.2197h-3c-.19891 0-.38968.079-.53033.2197-.14065.1406-.21967.3314-.21967.5303v3.75c0 .3978-.15804.7794-.43934 1.0607s-.66284.4393-1.06066.4393h-3.75c-.39782 0-.779356-.158-1.06066-.4393-.281305-.2813-.43933998-.6629-.43933998-1.0607v-8.66718c-.00003156-.20761.04303048-.41295.12646098-.60305.08343-.1901.205412-.36081.358226-.50133l7.500003-7.07625.01031-.010313c.27613-.251125.63597-.3902803 1.00922-.3902803s.73308.1391553 1.00918.3902803c.0032.003669.0067.007114.0103.010313l7.5 7.07625c.1513.14126.2717.3123.3537.50237.082.19006.1237.39503.1226.60201z"
                  className="svgColor"
                  fill="#b3b3b3"
                />
              </svg>
              <span>
                {variant === "desktopOpen" || size === "tablet"
                  ? "Overview"
                  : ""}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <svg
                fill="none"
                height="18"
                className="svgIcon"
                viewBox="0 0 18 18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m8.19292 12.9731c.05684.1371.07178.2879.04291.4334s-.10025.2792-.2051.3841l-3 3c-.06966.0698-.15237.1251-.24342.1628-.09105.0378-.18865.0572-.28721.0572s-.19615-.0194-.2872-.0572c-.09105-.0377-.17377-.093-.24342-.1628l-3.000003-3c-.105008-.1048-.176534-.2385-.205522-.3841-.028987-.1456-.014134-.2965.04268-.4336.056815-.1371.153035-.2543.276485-.3367.12344-.0824.26856-.1263.41698-.1262h2.25v-11.24998c0-.19891.07902-.389678.21967-.53033.14066-.140652.33142-.21967.53033-.21967.19892 0 .38968.079018.53033.21967s.21967.33142.21967.53033v11.24998h2.25c.14834 0 .29333.0441.41665.1265s.21943.1996.27617.3366zm8.83778-9.24371-3-2.999995c-.0696-.069732-.1523-.125051-.2434-.162795-.091-.037743-.1886-.05717-.2872-.05717s-.1962.019427-.2872.05717c-.091.037744-.1738.093063-.2434.162795l-3.00002 2.999995c-.10501.1049-.17654.23859-.20552.38415-.02899.14556-.01414.29646.04268.43357.05681.13712.15303.2543.27646.3367.1235.0824.2686.12633.417.12621h2.25v11.24998c0 .1989.079.3897.2197.5303.1406.1407.3314.2197.5303.2197s.3897-.079.5303-.2197c.1407-.1406.2197-.3314.2197-.5303v-11.24998h2.25c.1484.00012.2935-.04381.417-.12621.1234-.0824.2197-.19958.2765-.3367.0568-.13711.0716-.28801.0426-.43357-.0289-.14556-.1005-.27925-.2055-.38415z"
                  className="svgColor"
                  fill="#b3b3b3"
                />
              </svg>{" "}
              <span>
                {variant === "desktopOpen" || size === "tablet"
                  ? "Transactions"
                  : ""}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/budgets"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <svg
                fill="none"
                height="20"
                className="svgIcon"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m.32038 8.59187c.221475-1.85713.98107-3.60899 2.18531-5.04.13325-.16068.29856-.29177.48537-.38491.18681-.09313.391-.14625.59951-.15595.20851-.00971.41675.02421.61141.09958.19465.07538.37143.19055.51902.33816l2.59407 2.64937c.24982.24925.40292.57919.43194.93089.02902.35171-.06792.70228-.27351.98911-.15572.22092-.273.46656-.34687.72656-.02347.07671-.07091.14388-.13537.19164-.06446.04775-.14253.07357-.22276.07368h-6.074995c-.052937.00008-.105292-.01104-.153622-.03264s-.091539-.05319-.126785-.09268c-.035246-.0395-.06173-.08601-.077711-.13648s-.021095-.10374-.015007-.15633zm10.56002-8.57625c-.2072-.01806747-.4159.0071461-.6128.0740394-.1969.0668936-.37778.1740046-.53109.3145316-.15331.140528-.27573.3114-.35947.501766-.08374.190363-.12698.396063-.12697.604033v3.81282c-.00259.35379.12106.69691.34874.96772.22768.27082.54449.45156.89349.50978.6571.10841 1.2595.43241 1.7121.92093.4527.48852.73 1.11379.7881 1.77727.0581.66349-.1062 1.32739-.4671 1.88719-.3608.5598-.8977.9836-1.526 1.2046-.0731.0269-.1362.0755-.1808.1394s-.0685.1399-.0685.2178v6.1153c-.0004.0531.0105.1057.032.1542.0215.0486.0531.092.0926.1275.0395.0354.0861.0621.1367.0782s.104.0212.1568.0151c2.3399-.2889 4.4967-1.4131 6.0735-3.1658s2.4676-4.016 2.5084-6.37326c.0703-5.08968-3.826-9.431245-8.8697-9.88312zm-1.88815 12.57188c-.41923-.1495-.79993-.3905-1.1145-.7054-.31458-.3149-.55514-.6958-.70425-1.1152-.02556-.0744-.07354-.139-.13733-.185-.0638-.046-.14027-.0711-.21892-.0719h-6.124683c-.053006-.0003-.105481.0106-.153964.032s-.091873.0529-.127308.0923c-.035436.0394-.062111.0859-.078267.1364s-.021425.1038-.015461.1565c.262606 2.1669 1.244093 4.1833 2.787573 5.7268s3.55984 2.525 5.7268 2.7876c.05267.0059.10601.0007.15649-.0155.05049-.0162.09697-.0428.1364-.0783.03942-.0354.07088-.0788.0923-.1273.02143-.0485.03233-.1009.032-.1539v-6.1191c.00015-.0793-.02454-.1567-.07061-.2213-.04608-.0645-.11121-.113-.18627-.1387z"
                  className="svgColor"
                  fill="#b3b3b3"
                />
              </svg>{" "}
              <span>
                {variant === "desktopOpen" || size === "tablet"
                  ? "Budgets"
                  : ""}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pots"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <svg
                fill="none"
                height="22"
                className="svgIcon"
                viewBox="0 0 18 22"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m14.25 3.33595v-1.57594c0-.39782-.158-.779356-.4393-1.06066-.2813-.281305-.6629-.43934-1.0607-.43934h-7.5c-.39782 0-.77936.158035-1.06066.43934-.2813.281304-.43934.66284-.43934 1.06066v1.57594c-.84646.17368-1.60711.634-2.15363 1.30332-.54652.66931-.84545 1.50664-.84637 2.37074v10.49999c0 .9946.39509 1.9484 1.09835 2.6517.70326.7032 1.65709 1.0983 2.65165 1.0983h9c.9946 0 1.9484-.3951 2.6517-1.0983.7032-.7033 1.0983-1.6571 1.0983-2.6517v-10.49999c-.0009-.8641-.2999-1.70143-.8464-2.37074-.5465-.66932-1.3071-1.12964-2.1536-1.30332zm-6-1.57594h1.5v1.5h-1.5zm-3 0h1.5v1.5h-1.5zm4.5 14.24999v.75c0 .1989-.07902.3897-.21967.5303-.14065.1407-.33142.2197-.53033.2197s-.38968-.079-.53033-.2197c-.14065-.1406-.21967-.3314-.21967-.5303v-.75h-.75c-.19891 0-.38968-.079-.53033-.2197-.14065-.1406-.21967-.3314-.21967-.5303s.07902-.3897.21967-.5303c.14065-.1407.33142-.2197.53033-.2197h2.25c.19891 0 .3897-.079.5303-.2197.1407-.1406.2197-.3314.2197-.5303s-.079-.3897-.2197-.5303c-.1406-.1407-.33139-.2197-.5303-.2197h-1.5c-.59674 0-1.16903-.237-1.59099-.659s-.65901-.9943-.65901-1.591.23705-1.16902.65901-1.59098.99425-.65901 1.59099-.65901v-.75c0-.19891.07902-.38968.21967-.53033s.33142-.21967.53033-.21967.38968.07902.53033.21967.21967.33142.21967.53033v.75h.75c.1989 0 .3897.07902.5303.21967.1407.14065.2197.33142.2197.53033s-.079.38968-.2197.53033c-.1406.14065-.3314.21966-.5303.21966h-2.25c-.19891 0-.38968.079-.53033.2197-.14065.1406-.21967.3314-.21967.5303s.07902.3897.21967.5303c.14065.1407.33142.2197.53033.2197h1.5c.5967 0 1.169.2371 1.591.659.4219.422.659.9943.659 1.591s-.2371 1.169-.659 1.591c-.422.422-.9943.659-1.591.659zm3-12.74999h-1.5v-1.5h1.5z"
                  className="svgColor"
                  fill="#b3b3b3"
                />
              </svg>{" "}
              <span>
                {variant === "desktopOpen" || size === "tablet" ? "Pots" : ""}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recurring-bills"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <svg
                fill="none"
                height="28"
                className="svgIcon recurringBill "
                viewBox="0 0 32 28"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m24.4375 10.25c0 .2486-.0988.4871-.2746.6629s-.4143.2746-.6629.2746h-15c-.24864 0-.4871-.0988-.66291-.2746-.17582-.1758-.27459-.4143-.27459-.6629s.09877-.4871.27459-.66291c.17581-.17582.41427-.27459.66291-.27459h15c.2486 0 .4871.09877.6629.27459.1758.17581.2746.41431.2746.66291zm-.9375 4.0625h-15c-.24864 0-.4871.0988-.66291.2746-.17582.1758-.27459.4143-.27459.6629s.09877.4871.27459.6629c.17581.1758.41427.2746.66291.2746h15c.2486 0 .4871-.0988.6629-.2746s.2746-.4143.2746-.6629-.0988-.4871-.2746-.6629-.4143-.2746-.6629-.2746zm8.4375-11.5625v23.75c-.0002.1598-.0412.3168-.1191.4563-.078.1395-.1902.2567-.3262.3406-.1476.0921-.3182.1409-.4922.1406-.1453.0001-.2887-.0336-.4187-.0984l-4.5813-2.2907-4.5813 2.2907c-.13.0649-.2734.0987-.4187.0987s-.2887-.0338-.4187-.0987l-4.5813-2.2907-4.5813 2.2907c-.13.0649-.2734.0987-.4187.0987s-.2887-.0338-.4187-.0987l-4.5813-2.2907-4.58125 2.2907c-.14295.0713-.30178.105-.461388.0977-.159613-.0073-.314721-.0552-.450598-.1393-.135877-.084-.248016-.2014-.325769-.341-.077754-.1396-.1185428-.2967-.118495-.4565v-23.75c0-.58016.230468-1.13656.640704-1.5468.410236-.410232.966636-.6407 1.546796-.6407h27.5c.5802 0 1.1366.230468 1.5468.6407.4102.41024.6407.96664.6407 1.5468zm-1.875 0c0-.08288-.0329-.16237-.0915-.22097-.0586-.05861-.1381-.09153-.221-.09153h-27.5c-.08288 0-.16237.03292-.22097.09153-.05861.0586-.09153.13809-.09153.22097v22.2328l3.64375-1.8219c.13004-.0649.2734-.0987.41875-.0987s.28871.0338.41875.0987l4.58125 2.2907 4.5813-2.2907c.13-.0649.2734-.0987.4187-.0987s.2887.0338.4187.0987l4.5813 2.2907 4.5813-2.2907c.13-.0649.2734-.0987.4187-.0987s.2887.0338.4187.0987l3.6438 1.8219z"
                  fill="#fff"
                  className="svgColor"
                />
              </svg>{" "}
              <span>
                {variant === "desktopOpen" || size === "tablet"
                  ? "Recurring bills"
                  : ""}
              </span>
            </NavLink>
          </li>
          {user ? (
            <li>
              <NavLink to="/" onClick={handleLogout}>
                <img
                  src="/images/logout-svgrepo-com1.svg"
                  style={{ rotate: " 180deg " }}
                  alt="nav-icon"
                />
                <span>
                  {variant === "desktopOpen" || size === "tablet"
                    ? "Logout"
                    : ""}
                </span>
              </NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/login">
                <img src="/images/logout-svgrepo-com1.svg" alt="nav-icon" />
                <span>
                  {variant === "desktopOpen" || size === "tablet"
                    ? "Login"
                    : ""}
                </span>
              </NavLink>
            </li>
          )}
        </ul>
        <div className="imageMinimize" onClick={toggleSidebar}>
          <img
            src="/images/icon-minimize-menu.svg"
            alt="minimize"
            className={
              variant === "desktopClose" ? "rotate-closed" : "rotate-open"
            }
          />
          {variant === "desktopOpen" && <span>Minimize Menu</span>}
        </div>
      </div>
    </nav>
  );
};

export default SidebarMenu;
