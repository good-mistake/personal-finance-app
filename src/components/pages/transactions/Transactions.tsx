import React, { useState, useEffect, useRef } from "react";
import "./transactions.scss";
import Sidebar from "../../reusable/sidebar/Sidebar";
import SearchBar from "../../reusable/search/SearchBar.tsx";
import FilterSelect from "../../reusable/filter/FilterSelect.tsx";
import { formatCurrency, formatDate } from "../../../utils/utils.ts";
import datas from "../../../data.json";
import Pagination from "../../reusable/pagination/Pagination.tsx";
import Buttons from "../../reusable/button/Buttons.tsx";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import {
  openModal,
  setLoading,
  setTransactionsSlice,
} from "../../redux/transactionSlice.ts";
import { setAuthLoading } from "../../redux/userSlice.ts";
import TransactionModalManager from "./transactionModalManager/TransactionModalManager.tsx";
import { fetchTransaction } from "../../services/transactions.js";
import DropDownTransaction from "./transactiondropdown/TransactionDropdown.tsx";
import { v4 as uuidv4 } from "uuid";
import SkeletonTransaction from "../../reusable/skeleton/skeletonTransaction/SkeletonTransaction.tsx";
import useMediaQuery from "../../../utils/useMediaQuery.tsx";

const Transactions: React.FC = () => {
  const dispatch = useDispatch();
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [category, setCategory] = useState("All Transactions");
  const [sortOption, setSortOption] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery("mobile");
  const isMobileSm = useMediaQuery("mobilesm");
  const isTablet = useMediaQuery("tablet");
  const sidebarVariant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { isAuthenticated, authLoading } = useSelector(
    (state: RootState) => state.user
  );
  const transactionsFromRedux = useSelector(
    (state: RootState) => state.transaction.transaction
  );
  const loading = useSelector((state: RootState) => state.transaction.loading);
  const itemsPerPage = 10;

  const categories = [
    "All Transactions",
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Personal Care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General",
  ];

  const sortOptions = [
    "Latest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Highest",
    "Lowest",
  ];
  useEffect(() => {
    const fetchTransactionss = async () => {
      dispatch(setLoading(true));

      try {
        if (isAuthenticated) {
          const token = localStorage.getItem("token");
          const fetchedTransactions = await fetchTransaction(token);
          const normalizedTransactions = fetchedTransactions.map(
            (transaction) => ({
              ...transaction,
              id: transaction.id || transaction._id || uuidv4(),
              recurring: transaction.recurring || false,
            })
          );
          dispatch(
            setTransactionsSlice({
              transactions: normalizedTransactions,
              isAuthenticated: true,
            })
          );
          dispatch(setAuthLoading(false));
        } else {
          dispatch(setAuthLoading(false));
          const transactionsWithIds = datas.transactions.map((t) => ({
            ...t,
            id: uuidv4(),
            recurring: t.recurring || false,
          }));
          dispatch(
            setTransactionsSlice({
              transactions: transactionsWithIds,
              isAuthenticated: false,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching user transactions:", error);
      } finally {
        dispatch(setLoading(false));
        dispatch(setAuthLoading(false));
      }
    };

    fetchTransactionss();
  }, [dispatch, isAuthenticated, authLoading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openDropdownId) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDropdownId]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const clickedElement = e.target as Node;

      if (!openDropdownId) {
        return;
      }

      const currentDropdown = dropdownRefs.current.get(openDropdownId);

      if (!currentDropdown) {
        return;
      }

      if (!currentDropdown.contains(clickedElement)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openDropdownId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
  };

  const handleCategorySelect = (category: string) => {
    setCategory(category);
  };

  const filteredTransactions = transactionsFromRedux
    .filter((transaction) => {
      const matchesCategory =
        category === "All Transactions" || transaction.category === category;

      const matchesSearch =
        !searchQuery ||
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
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

  const totalItems = filteredTransactions.length;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDropdown = (transactionId: string) => {
    setOpenDropdownId((prevId) =>
      prevId === transactionId ? null : transactionId
    );
  };
  function shortenText(text: string, maxLength: number = 8): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  return (
    <div className={`transactionContainer`}>
      <Sidebar variant={sidebarVariant} position="right">
        {loading || authLoading ? (
          <SkeletonTransaction />
        ) : (
          <>
            <div className="transactionHeader">
              {!isMobile ? <h1>Transactions</h1> : ""}

              <Buttons
                variant="primary"
                disabled={false}
                size="large"
                onClick={() => dispatch(openModal("addTransaction"))}
              >
                + Add Transction
              </Buttons>
            </div>
            <div className="transactions">
              <div className="tansaction">
                <div className="searchAndFilters">
                  <div className="search">
                    <SearchBar
                      onSearch={handleSearch}
                      placeholder="Search transaction"
                    />
                  </div>
                  <div className="filters">
                    <div>
                      <FilterSelect
                        label="Sort"
                        options={sortOptions}
                        onSelect={handleSort}
                        firstSelect="Latest"
                        variant="alternate"
                      />
                    </div>

                    <div>
                      <FilterSelect
                        label="Category"
                        options={categories}
                        onSelect={handleCategorySelect}
                        firstSelect="All Transactions"
                      />
                    </div>
                  </div>
                </div>
                <div className="details">
                  <ul>
                    {!isMobile && (
                      <li>
                        <div className="nameAndImg">
                          <h3>Recipient / Sender</h3>
                        </div>
                        <p className="category">Category</p>
                        <p className="date">Transaction Date</p>
                        <p className="amount"> Amount</p>
                      </li>
                    )}

                    {paginatedTransactions.map((transaction) => (
                      <li
                        key={
                          transaction.id ||
                          `${transaction.name}-${transaction.amount}-${transaction.date}`
                        }
                      >
                        <div
                          className="nameAndImg"
                          onClick={() =>
                            transaction.id && toggleDropdown(transaction.id)
                          }
                        >
                          {transaction.avatar ? (
                            <img
                              src={transaction.avatar.replace(
                                /^\.\/assets/,
                                ""
                              )}
                              alt={transaction.name || "Transaction"}
                            />
                          ) : (
                            <div
                              className="transactionAvatarColor"
                              style={{
                                backgroundColor: transaction.theme || "#ccc",
                              }}
                            ></div>
                          )}{" "}
                          {!isMobile ? (
                            <h3>{transaction.name}</h3>
                          ) : (
                            <div className="nameAndCategoryMobile">
                              <h3>
                                {isMobileSm
                                  ? shortenText(transaction.name)
                                  : transaction.name}
                              </h3>
                              <p className="category">{transaction.category}</p>{" "}
                            </div>
                          )}
                        </div>
                        {openDropdownId === transaction.id && (
                          <div
                            className="dropDownTransaction "
                            ref={(el) => {
                              if (transaction.id) {
                                if (el) {
                                  dropdownRefs.current.set(transaction.id, el);
                                } else {
                                  dropdownRefs.current.delete(transaction.id);
                                }
                              }
                            }}
                          >
                            <DropDownTransaction
                              transactionId={transaction.id}
                            />
                          </div>
                        )}{" "}
                        {!isMobile ? (
                          <>
                            <p className="category">{transaction.category}</p>{" "}
                            <p className="date">
                              {formatDate(transaction.date)}
                            </p>
                            <p
                              className={`amount ${
                                transaction.amount < 0 ? "negative" : "positive"
                              }`}
                            >
                              {transaction.amount > 0 && "+"}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </>
                        ) : (
                          <div className="dateAndAmountMobile">
                            <p
                              className={`amount ${
                                transaction.amount < 0 ? "negative" : "positive"
                              }`}
                            >
                              {transaction.amount > 0 && "+"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="date">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>{" "}
                <Pagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
            {isMobile ? <h1>Transactions</h1> : ""}
          </>
        )}
      </Sidebar>
      <TransactionModalManager />
    </div>
  );
};

export default Transactions;
