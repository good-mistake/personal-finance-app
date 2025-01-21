import React, { useState } from "react";
import Sidebar from "../../reusable/sidebar/Sidebar";
import datas from "../../../data.json";
import Pagination from "../../reusable/pagination/Pagination";
import "./recurringBills.scss";
import SearchBar from "../../reusable/search/SearchBar.tsx";
import { formatCurrency, formatDueDate } from "../../../utils/utils";
import FilterSelect from "../../reusable/filter/FilterSelect.tsx";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import SkeletonRec from "../../reusable/skeleton/skeletonRec/SkeletonRec.tsx";
import useMediaQuery from "../../../utils/useMediaQuery.tsx";

type Transaction = {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
  avatar?: string;
  theme?: string;
};

const RecurringBills = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("mobile");
  const isTablet = useMediaQuery("tablet");
  const sidebarVariant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const { isAuthenticated, user, authLoading } = useSelector(
    (state: RootState) => state.user
  );
  const transactions =
    isAuthenticated && user && user.transactions
      ? user.transactions
      : datas.transactions || [];
  console.log(transactions);
  console.log("user", user?.transactions);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
  };
  const sortOptions = [
    "Latest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Highest",
    "Lowest",
  ];

  const itemsPerPage = 10;
  const today = new Date();

  let paidTotal = 0;
  let dueSoonTotal = 0;
  let upcomingTotal = 0;
  let paidCount = 0;
  let dueSoonCount = 0;
  let upcomingCount = 0;
  const recurringBills = transactions
    .filter((e) => e.recurring === true)
    .reduce((uniqueBills: Transaction[], bill) => {
      const isDuplicate = uniqueBills.some(
        (uniqueBill) =>
          uniqueBill.name === bill.name && uniqueBill.category === bill.category
      );

      if (!isDuplicate) {
        uniqueBills.push(bill);
      }
      return uniqueBills;
    }, []);

  const filteredTransactions = recurringBills
    .filter((transaction) => {
      const matchesSearch =
        !searchQuery ||
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "Latest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "Oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "A to Z":
          return a.name.localeCompare(b.name);
        case "Z to A":
          return b.name.localeCompare(a.name);
        case "Highest":
          return b.amount - a.amount;
        case "Lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const categorizedBills = filteredTransactions.map((bill) => {
    const billDate = new Date(bill.date).getDate();
    const todayDate = today.getDate();
    let status;
    if (billDate < todayDate) {
      status = "Paid";
      paidTotal += Math.abs(bill.amount);
      paidCount++;
    } else {
      status = "Upcoming";
      upcomingTotal += Math.abs(bill.amount);
      upcomingCount++;

      if (billDate <= todayDate + 5) {
        status = "Due Soon";
        dueSoonTotal += Math.abs(bill.amount);
        dueSoonCount++;
      }
    }
    return { ...bill, status };
  });

  const totalItems = categorizedBills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBills = categorizedBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="billContainer">
      <Sidebar variant={sidebarVariant} position="left">
        {authLoading ? (
          <SkeletonRec />
        ) : (
          <>
            <h1>Recurring Bills</h1>
            <div className="billContent">
              <div className="left">
                <div className="total">
                  <img src="/images/icon-recurring-bills.svg" alt="" />
                  <div>
                    <p>Total Bills</p>
                    <div>${paidTotal + upcomingTotal}</div>
                  </div>
                </div>
                <div className="summary">
                  <h3>Summary</h3>
                  <div>
                    <p className="paid">
                      Paid Bills
                      <span>
                        {paidCount} ({formatCurrency(paidTotal)})
                      </span>
                    </p>
                    <p className="upcoming">
                      Total Upcoming
                      <span>
                        {upcomingCount} ({formatCurrency(upcomingTotal)})
                      </span>
                    </p>
                    <p className="soon">
                      Due Soon
                      <span>
                        {dueSoonCount} ({formatCurrency(dueSoonTotal)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bills">
                <div className="searchFilter">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search bills"
                  />
                  <FilterSelect
                    label="Sort by  "
                    options={sortOptions}
                    onSelect={handleSort}
                    firstSelect="Latest"
                    variant="alternate"
                  />
                </div>
                <ul>
                  {!isMobile ? (
                    <li className="categories">
                      <div className="nameAndImg">
                        <p>Bill Title</p>
                      </div>
                      <p className={`date`}>Due Date</p>
                      <p className={`amount `}>Amount</p>
                    </li>
                  ) : (
                    ""
                  )}
                  {paginatedBills.length > 0 ? (
                    <>
                      {paginatedBills.map((bill, index) => (
                        <li key={index}>
                          {!isMobile ? (
                            <div className="nameAndImg">
                              {bill.avatar ? (
                                <img
                                  src={bill.avatar.replace(/^\.\/assets/, "")}
                                  alt={bill.name || "Transaction"}
                                />
                              ) : (
                                <div
                                  className="billAvatarColor"
                                  style={{
                                    backgroundColor: bill.theme || "#ccc",
                                  }}
                                ></div>
                              )}
                              <h3>{bill.name}</h3>
                            </div>
                          ) : (
                            <div className="nameAndImg">
                              <div>
                                {" "}
                                {bill.avatar ? (
                                  <img
                                    src={bill.avatar.replace(/^\.\/assets/, "")}
                                    alt={bill.name || "Transaction"}
                                  />
                                ) : (
                                  <div
                                    className="billAvatarColor"
                                    style={{
                                      backgroundColor: bill.theme || "#ccc",
                                    }}
                                  ></div>
                                )}
                                <h3>{bill.name}</h3>
                              </div>{" "}
                              <p
                                className={`date ${
                                  bill.status === "Paid" ? "paid" : ""
                                }`}
                              >
                                {formatDueDate(bill.date)}
                                {bill.status === "Due Soon" && (
                                  <img
                                    src="/images/icon-bill-due.svg"
                                    alt="Due Soon"
                                    className="due-soon-icon"
                                  />
                                )}
                                {bill.status === "Paid" && (
                                  <img
                                    src="/images/icon-bill-paid.svg"
                                    alt="Due Soon"
                                    className="due-soon-icon"
                                  />
                                )}
                              </p>
                            </div>
                          )}

                          {!isMobile ? (
                            <p
                              className={`date ${
                                bill.status === "Paid" ? "paid" : ""
                              }`}
                            >
                              {formatDueDate(bill.date)}
                              {bill.status === "Due Soon" && (
                                <img
                                  src="/images/icon-bill-due.svg"
                                  alt="Due Soon"
                                  className="due-soon-icon"
                                />
                              )}
                              {bill.status === "Paid" && (
                                <img
                                  src="/images/icon-bill-paid.svg"
                                  alt="Due Soon"
                                  className="due-soon-icon"
                                />
                              )}
                            </p>
                          ) : (
                            ""
                          )}

                          <p
                            className={`amount ${
                              bill.status === "Due Soon" ? "dueSoon" : ""
                            }`}
                          >
                            {formatCurrency(Math.abs(bill.amount))}
                          </p>
                        </li>
                      ))}
                    </>
                  ) : (
                    <p>No recurring bills found.</p>
                  )}{" "}
                </ul>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Sidebar>
    </div>
  );
};

export default RecurringBills;
