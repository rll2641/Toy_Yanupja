package com.fastcampus.toy_yanupja.common.handler.status;

import com.fastcampus.toy_yanupja.dto.accomm.enums.AccommodationStatus;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(AccommodationStatus.class) /* 처리할 자바 타입 지정 */
@MappedJdbcTypes(JdbcType.VARCHAR) /* 처리할 JDBC 타입 지정 */
public class AccommStatusTypeHandler extends BaseTypeHandler<AccommodationStatus> {

    /* Java -> DB : PreparedStatment에 값 설정 */
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                    AccommodationStatus parameter, JdbcType jdbcType) throws SQLException {
        /* Java Enum -> DB String 변환 */
        ps.setString(i, parameter.getValue());
    }

    // DB -> Java : ResultSet에서 컬럼명으로 값 조회
    @Override
    public AccommodationStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : AccommodationStatus.findValue(value);
    }

    // DB -> Java : ResultSet에서 컬럼 인덱스로 값 조회
    @Override
    public AccommodationStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : AccommodationStatus.findValue(value);
    }

    // DB -> Java : CallableStatement에서 값 조회
    @Override
    public AccommodationStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : AccommodationStatus.findValue(value);
    }
}
