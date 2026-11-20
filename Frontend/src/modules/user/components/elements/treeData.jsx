import React, { useState } from "react";
import { FaFolder, FaChevronRight, FaChevronDown } from "react-icons/fa";

const treeData = [
  {
    id: 1,
    label: "NIC Bhubaneswar",
    count: 3,
    children: [
      {
        id: 2,
        label: "eoffice KMD",
        count: 1,
      },
    ],
  },
  {
    id: 3,
    label: "Ministry of Electronics and Information Technology",
    count: 86,
    children: [
      {
        id: 4,
        label: "National Informatics Centre",
        count: 59,
        children: [
          { id: 5, label: "NICSI", count: 1 },
          { id: 6, label: "NIC HQs", count: 18 },
          { id: 7, label: "NIC State Centres", count: 1 },
          { id: 8, label: "NIC Centres", count: 32 },
        ],
      },
      { id: 9, label: "Vinodg", count: 1 },
    ],
  },
  { id: 10, label: "eOffice", count: 118 },
  { id: 11, label: "Cello", count: 113 },
];

const TreeNode = ({ node, onNodeClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = node?.children && node.children.length > 0;

  const toggleNode = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleNodeClick = () => {
    onNodeClick(node);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          background: "#e9ecef",
          marginBottom: "4px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={handleNodeClick}
      >
        <div
          onClick={hasChildren ? toggleNode : undefined}
          style={{ marginRight: 6, width: 16 }}
        >
          {hasChildren ? (
            isOpen ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )
          ) : null}
        </div>

        <FaFolder color="#f4a300" style={{ marginRight: 8 }} />

        <span>
          {node.label} ({node.count})
        </span>
      </div>

      {hasChildren && isOpen && (
        <div style={{ paddingLeft: "20px" }}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default function FolderTree({ onNodeClick }) {
  return (
    <div className="category-bg-color" style={{ width: "100%`", fontFamily: "Arial, sans-serif" }}>
      {treeData.map((node) => (
        <TreeNode key={node.id} node={node} onNodeClick={onNodeClick} />
      ))}
    </div>
  );
}