import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DashboardForm from "../../component/features/dashboard/DashboardForm";
import { 
  getGroupList, 
  getStudentList, 
  getAnalytics, 
  getTopSearchKeywords, 
  getSolutionUsage,
  getWorldCloud,
  getNoteUsage,
  test
} from "../../service/dashboard"; 

const Dashboard: React.FC = () => {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ _id: string; student_id: string; student_name: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const [chartData, setChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);

  const [noteUsage, setNoteUsage] = useState<any>(null);

  // 그룹 목록 가져오기
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroupList();
        setGroups(res.groups);
        setSelectedGroup(res.groups[0].name);
        setSelectedGroupId(res.groups[0].id);

        // 기본 학생 세팅
        setSelectedStudent(res.default.student.name);
        setSelectedStudentId(res.default.student.id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  // 그룹 선택 → 학생 목록 가져오기
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudentList(selectedGroupId);
        console.log(res)
        setStudents(res.students);
        setSelectedStudent(res.students[0].student_name)
        setSelectedStudentId(res.students[0].student_id)
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId) return;
    const fetchAnalytics = async () => {
      try {
        const res = await getSolutionUsage(selectedStudentId);
        setChartData(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, [selectedStudentId]);

  useEffect(() => {
    if (!selectedGroupId) return;
    const fetchTopKeywords = async () => {
      try {
        const res = await getWorldCloud(selectedStudentId);
        setPieChartData(res.img_url);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopKeywords();
  }, [selectedStudentId]);

  useEffect(() => {
    if (!selectedGroupId) return;
    const fetchNoteUsage = async () => {
      const res = await getNoteUsage(selectedStudentId);
      setNoteUsage(res);
    };
    fetchNoteUsage();
  }, [selectedStudentId,]);

  return (
    <Container>
      <DashboardForm
        groupList={groups}
        studentList={students}
        selectedGroup={selectedGroup}
        selectedGroupId={selectedGroupId}
        setSelectedGroup={setSelectedGroup}
        setSelectedGroupId={setSelectedGroupId}
        selectedStudent={selectedStudent}
        selectedStudentId={selectedStudentId}
        setSelectedStudent={setSelectedStudent}
        setSelectedStudentId={setSelectedStudentId}
        chartData={chartData}
        pieChartData={pieChartData}
        noteUsage={noteUsage}
      />
    </Container>
  );
};

export default Dashboard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;